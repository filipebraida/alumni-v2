import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

import { UserFactory } from '#database/factories/user_factory'
import { EgressoFactory } from '#database/factories/egresso_factory'
import { InstitutoFactory } from '#database/factories/instituto_factory'
import { CursoFactory } from '#database/factories/curso_factory'
import { MatriculaFactory } from '#database/factories/matricula_factory'
import { RespostaPessoaFactory } from '#database/factories/resposta_pessoa_factory'

/**
 * Setup compartilhado: egresso autenticado com 1 graduação formada e sem
 * RespostaPessoa anterior. Devolve user, egresso, matricula.
 */
async function egressoCom1Graduacao() {
  const user = await UserFactory.create()
  const egresso = await EgressoFactory.apply('comConsentimento').merge({ userId: user.id }).create()
  const instituto = await InstitutoFactory.create()
  const curso = await CursoFactory.apply('graduacao').merge({ institutoId: instituto.id }).create()
  const matricula = await MatriculaFactory.apply('formada')
    .merge({ egressoId: egresso.id, cursoId: curso.id })
    .create()
  return { user, egresso, matricula }
}

// Helpers pro fluxo styled (card-por-campo com "Mudou/Adicionar" → editor → Salvar).
// `page` é o Page decorado do @japa/browser-client; tipa-se via inferência no chamador.

type PageDriver = any

async function abrirEditor(page: PageDriver, campoId: string) {
  await page
    .locator(`[data-campo="${campoId}"]`)
    .getByRole('button', { name: /Adicionar|Mudou/ })
    .click()
}

async function salvarEditor(page: PageDriver, campoId: string) {
  await page
    .locator(`[data-campo="${campoId}"]`)
    .getByRole('button', { name: /^Salvar$/ })
    .click()
}

async function editarTexto(page: PageDriver, campoId: string, ariaLabel: string, valor: string) {
  await abrirEditor(page, campoId)
  // Escopa pelo card pra não colidir com aria-labels iguais em outros pontos
  // (ex.: SVG do logo tem aria-label que casa com 'UFRRJ').
  await page.locator(`[data-campo="${campoId}"]`).getByLabel(ariaLabel).fill(valor)
  await salvarEditor(page, campoId)
}

async function editarLocal(page: PageDriver, cidade: string, uf: string) {
  const card = page.locator('[data-campo="localizacao"]')
  await abrirEditor(page, 'localizacao')
  if (cidade) await card.getByLabel('Cidade').fill(cidade)
  if (uf) await card.getByLabel('UF').fill(uf)
  await salvarEditor(page, 'localizacao')
}

async function escolherOpcao(page: PageDriver, campoId: string, rotuloOpcao: string) {
  await abrirEditor(page, campoId)
  // EditorOpcoes salva no clique do botão da opção — sem Salvar separado.
  await page
    .locator(`[data-campo="${campoId}"]`)
    .getByRole('button', { name: rotuloOpcao, exact: true })
    .click()
}

async function concluir(page: PageDriver) {
  await page.getByRole('button', { name: /Concluir/ }).click()
}

test.group('RespostasController.store', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('submissão completa cria 1 RespostaPessoa + N RespostaCurso e redirect /dashboard com flash', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const { user, egresso, matricula } = await egressoCom1Graduacao()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    await editarLocal(page, 'Rio de Janeiro', 'RJ')
    await editarTexto(page, 'empregador', 'Empresa ou instituição', 'Embrapa Solos')
    await editarTexto(page, 'cargo', 'Cargo / função', 'Engenheira')
    await escolherOpcao(page, 'setor', 'Pesquisa pública')
    await escolherOpcao(page, 'faixaSalarial', 'R$ 9.000 — R$ 12.000')
    await escolherOpcao(page, 'relacaoFormacao', 'Sim, totalmente relacionado')
    await escolherOpcao(page, 'tempoPrimeiroEmprego', 'Menos de 3 meses')

    await concluir(page)

    await page.assertPath('/dashboard')
    await page.assertVisible(
      'text=Pronto! Seus dados foram atualizados — obrigado por manter seu cadastro fresquinho.'
    )
    await db.assertCount('respostas_pessoa', 1)
    await db.assertHas('respostas_pessoa', { egresso_id: egresso.id, ano: DateTime.now().year })
    await db.assertCount('respostas_curso', 1)
    await db.assertHas('respostas_curso', { matricula_id: matricula.id })
  })

  test('submissão parcial herda valores não tocados da última resposta', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const { user, egresso } = await egressoCom1Graduacao()
    await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      cargo: 'Engenheira',
      setor: 'pesquisa_publica',
      empregador: 'Embrapa',
    }).create()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    // Só altera o cargo — setor e empregador devem ser herdados.
    await editarTexto(page, 'cargo', 'Cargo / função', 'Coordenadora')
    await concluir(page)
    await page.assertPath('/dashboard')

    await db.assertCount('respostas_pessoa', 2)
    await db.assertHas('respostas_pessoa', {
      cargo: 'Coordenadora',
      setor: 'pesquisa_publica',
      empregador: 'Embrapa',
    })
  })

  test('RespostaCurso de matrícula de pós nasce com 3 colunas de graduação null', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const grad = await CursoFactory.apply('graduacao').merge({ institutoId: instituto.id }).create()
    const mest = await CursoFactory.apply('mestrado').merge({ institutoId: instituto.id }).create()
    await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: grad.id })
      .create()
    const mestMat = await MatriculaFactory.apply('cursando')
      .merge({ egressoId: egresso.id, cursoId: mest.id })
      .create()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    // Preenche só campos da graduação; mestrado mostra "em breve".
    await escolherOpcao(page, 'faixaSalarial', 'R$ 9.000 — R$ 12.000')
    await concluir(page)

    await db.assertCount('respostas_curso', 2)
    await db.assertHas('respostas_curso', {
      matricula_id: mestMat.id,
      faixa_salarial: null,
      relacao_formacao: null,
      tempo_primeiro_emprego: null,
    })
  })

  test('validação falha (UF com 1 caractere) → banner mostra erro Vine', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const { user } = await egressoCom1Graduacao()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    await editarLocal(page, 'Rio', 'R')
    await concluir(page)

    await page.assertPath('/respostas/create')
    // Vine reporta erro de fixedLength; o copy default contém "characters".
    await page.assertVisible('text=characters')
    await db.assertCount('respostas_pessoa', 0)
  })

  test('append-only: duas submissões consecutivas criam 2 linhas em respostas_pessoa', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const { user } = await egressoCom1Graduacao()

    await browserContext.loginAs(user)

    // Submissão 1
    const page1 = await visit(route('respostas.create'))
    await editarTexto(page1, 'cargo', 'Cargo / função', 'Cargo A')
    await concluir(page1)
    await page1.assertPath('/dashboard')

    // Submissão 2
    const page2 = await visit(route('respostas.create'))
    await editarTexto(page2, 'cargo', 'Cargo / função', 'Cargo B')
    await concluir(page2)
    await page2.assertPath('/dashboard')

    await db.assertCount('respostas_pessoa', 2)
    await db.assertCount('respostas_curso', 2)
  })
})
