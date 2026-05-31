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

    await page.getByLabel('Cidade').fill('Rio de Janeiro')
    await page.getByLabel('UF').fill('RJ')
    await page.getByLabel('País').fill('Brasil')
    await page.getByLabel('Empresa atual').fill('Embrapa Solos')
    await page.getByLabel('Cargo / função').fill('Engenheira')
    await page.getByLabel('Setor').selectOption('pesquisa_publica')
    await page.getByLabel('Faixa salarial').selectOption('de_9k_12k')
    await page.getByLabel('Atua na área formada?').selectOption('total')
    await page.getByLabel('Tempo até o 1º emprego').selectOption('ate_3m')

    await page.getByRole('button', { name: 'Concluir' }).click()

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
    await page.getByLabel('Cargo / função').fill('Coordenadora')
    await page.getByRole('button', { name: 'Concluir' }).click()
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
    await page.getByLabel('Faixa salarial').selectOption('de_9k_12k')
    await page.getByRole('button', { name: 'Concluir' }).click()

    await db.assertCount('respostas_curso', 2)
    await db.assertHas('respostas_curso', {
      matricula_id: mestMat.id,
      faixa_salarial: null,
      relacao_formacao: null,
      tempo_primeiro_emprego: null,
    })
  })

  test('validação falha (UF com 1 caractere) → DOM mostra erro Vine', async ({
    visit,
    route,
    browserContext,
    db,
  }) => {
    const { user } = await egressoCom1Graduacao()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    await page.getByLabel('UF').fill('R')
    await page.getByRole('button', { name: 'Concluir' }).click()

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
    await page1.getByLabel('Cargo / função').fill('Cargo A')
    await page1.getByRole('button', { name: 'Concluir' }).click()
    await page1.assertPath('/dashboard')

    // Submissão 2
    const page2 = await visit(route('respostas.create'))
    await page2.getByLabel('Cargo / função').fill('Cargo B')
    await page2.getByRole('button', { name: 'Concluir' }).click()
    await page2.assertPath('/dashboard')

    await db.assertCount('respostas_pessoa', 2)
    await db.assertCount('respostas_curso', 2)
  })
})
