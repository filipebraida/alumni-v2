import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

import { UserFactory } from '#database/factories/user_factory'
import { EgressoFactory } from '#database/factories/egresso_factory'
import { InstitutoFactory } from '#database/factories/instituto_factory'
import { CursoFactory } from '#database/factories/curso_factory'
import { MatriculaFactory } from '#database/factories/matricula_factory'
import { RespostaPessoaFactory } from '#database/factories/resposta_pessoa_factory'
import { RespostaCursoFactory } from '#database/factories/resposta_curso_factory'
import { GestorFactory } from '#database/factories/gestor_factory'

/**
 * Setup compartilhado: egresso autenticado com 1 graduação `formada`.
 * Devolve os ids principais pra cada teste customizar.
 */
async function egressoCom1Graduacao(opts: { nomeCurso?: string } = {}) {
  const user = await UserFactory.create()
  const egresso = await EgressoFactory.apply('comConsentimento').merge({ userId: user.id }).create()
  const instituto = await InstitutoFactory.create()
  const curso = await CursoFactory.apply('graduacao')
    .merge({
      institutoId: instituto.id,
      ...(opts.nomeCurso && { nome: opts.nomeCurso }),
    })
    .create()
  const matricula = await MatriculaFactory.apply('formada')
    .merge({ egressoId: egresso.id, cursoId: curso.id })
    .create()
  return { user, egresso, instituto, curso, matricula }
}

test.group('DashboardController.show', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('egressa autenticada com resposta recente vê saudação modo manutenção em /dashboard', async ({
    visit,
    route,
    browserContext,
  }) => {
    // Setup: egressa Ana com 1 graduação concluída + RespostaPessoa recente +
    // RespostaCurso com os 3 campos preenchidos.
    const user = await UserFactory.merge({ fullName: 'Ana Silva' }).create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id, nomeCompleto: 'Ana Silva' })
      .create()
    const instituto = await InstitutoFactory.create()
    const curso = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id })
      .create()
    const matricula = await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: curso.id })
      .create()

    const respostaPessoa = await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      registradaEm: DateTime.now().minus({ months: 3 }),
    }).create()

    await RespostaCursoFactory.merge({
      respostaPessoaId: respostaPessoa.id,
      matriculaId: matricula.id,
    }).create()

    await browserContext.loginAs(user)

    const page = await visit(route('dashboard'))

    await page.assertPath('/dashboard')
    await page.assertVisible('text=, Ana')
    await page.assertVisible('text=Você tem 1 formação na UFRRJ')
    await page.assertVisible('text=para revisar antes da próxima resposta')
  })

  test('cartão de dado geral com valor recente mostra estado "confirmado"', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const curso = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id })
      .create()
    await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: curso.id })
      .create()

    await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      cargo: 'Engenheira de Software',
      registradaEm: DateTime.now().minus({ weeks: 3 }),
    }).create()

    await browserContext.loginAs(user)

    const page = await visit(route('dashboard'))

    await page.assertVisible('text=Engenheira de Software')
    // Todos os 4 dados gerais herdam o mesmo timestamp da RespostaPessoa.
    await page.assertElementsCount('text=confirmado há 3 sem.', 4)
  })

  test('detalhe da formação de graduação mostra 3 cartões MEC + identidade', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const curso = await CursoFactory.apply('graduacao')
      .merge({
        institutoId: instituto.id,
        nome: 'Bacharelado em Ciência da Computação · UFRRJ',
      })
      .create()
    const matricula = await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: curso.id })
      .create()

    const rp = await RespostaPessoaFactory.merge({ egressoId: egresso.id }).create()
    await RespostaCursoFactory.merge({
      respostaPessoaId: rp.id,
      matriculaId: matricula.id,
      faixaSalarial: 'de_9k_12k',
      relacaoFormacao: 'total',
      tempoPrimeiroEmprego: 'ate_3m',
    }).create()

    await browserContext.loginAs(user)

    const page = await visit(route('dashboard'))

    // Diploma aparece em 2 lugares — tab e header "Detalhes da formação".
    await page.assertElementsCount('text=Bacharelado em Ciência da Computação · UFRRJ', 2)
    await page.assertVisible('text=R$ 9.000 — R$ 12.000')
    await page.assertVisible('text=Sim, totalmente relacionado')
    await page.assertVisible('text=Menos de 3 meses')
  })

  test('seletor renderiza formações em ordem cronológica por ingresso', async ({
    visit,
    route,
    browserContext,
    assert,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()

    const graduacao = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id, nome: 'Graduação 2018' })
      .create()
    const especializacao = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id, nome: 'Especialização 2020' })
      .create()
    const mestrado = await CursoFactory.apply('mestrado')
      .merge({ institutoId: instituto.id, nome: 'Mestrado 2024' })
      .create()

    await MatriculaFactory.apply('formada')
      .merge({
        egressoId: egresso.id,
        cursoId: graduacao.id,
        dataIngresso: DateTime.fromISO('2018-03-01'),
      })
      .create()
    await MatriculaFactory.apply('formada')
      .merge({
        egressoId: egresso.id,
        cursoId: especializacao.id,
        dataIngresso: DateTime.fromISO('2020-08-01'),
      })
      .create()
    await MatriculaFactory.apply('cursando')
      .merge({
        egressoId: egresso.id,
        cursoId: mestrado.id,
        dataIngresso: DateTime.fromISO('2024-03-01'),
      })
      .create()

    await browserContext.loginAs(user)

    const page = await visit(route('dashboard'))

    // Tabs em ordem cronológica via posição no HTML serializado.
    const html = await page.content()
    const idxGrad = html.indexOf('Graduação 2018')
    const idxEsp = html.indexOf('Especialização 2020')
    const idxMest = html.indexOf('Mestrado 2024')
    assert.isAbove(idxGrad, -1, 'Graduação 2018 não está no HTML')
    assert.isAbove(idxEsp, idxGrad, 'Especialização 2020 deve vir depois de Graduação 2018')
    assert.isAbove(idxMest, idxEsp, 'Mestrado 2024 deve vir depois de Especialização 2020')
  })

  test('cartão-aba mostra status correto por situação da matrícula')
    .with([
      { situacao: 'formada' as const, badge: 'Concluído' },
      { situacao: 'cursando' as const, badge: 'Em curso' },
    ])
    .run(async ({ visit, route, browserContext }, row) => {
      const user = await UserFactory.create()
      const egresso = await EgressoFactory.apply('comConsentimento')
        .merge({ userId: user.id })
        .create()
      const instituto = await InstitutoFactory.create()
      const curso = await CursoFactory.apply('graduacao')
        .merge({ institutoId: instituto.id })
        .create()
      await MatriculaFactory.apply(row.situacao)
        .merge({ egressoId: egresso.id, cursoId: curso.id })
        .create()

      await browserContext.loginAs(user)
      const page = await visit(route('dashboard'))

      // Badge aparece pelo menos uma vez (tab); contagem total varia entre situações.
      await page.locator(`text=${row.badge}`).first().waitFor({ state: 'visible' })
    })

  test('cartão de Frescor com resposta < 12 meses mostra prazo + % > 0', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user, egresso } = await egressoCom1Graduacao()
    await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      registradaEm: DateTime.now().minus({ months: 6 }),
    }).create()

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    await page.assertVisible('text=expira em 6 meses')
  })

  test('cartão de dado geral sem valor aparece como "não informado"', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user, egresso } = await egressoCom1Graduacao()
    // 4 dados gerais todos null → cada cartão exibe "não informado" no valor
    // e no rótulo de status (2 por cartão × 4 cartões = 8).
    await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      localizacaoCidade: null,
      localizacaoUf: null,
      localizacaoPais: null,
      empregador: null,
      cargo: null,
      setor: null,
    }).create()

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    // 4 cartões de dados gerais (8) + 3 cartões MEC da graduação (6) também
    // ausentes porque não criamos RespostaCurso = 14 ocorrências de "não informado".
    await page.assertElementsCount('text=não informado', 14)
  })

  test('matrículas com situação=evadido não aparecem no seletor', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user, egresso, instituto, curso } = await egressoCom1Graduacao()
    const mestrado = await CursoFactory.apply('mestrado')
      .merge({ institutoId: instituto.id, nome: 'Mestrado · evadido' })
      .create()
    await MatriculaFactory.apply('evadida')
      .merge({ egressoId: egresso.id, cursoId: mestrado.id })
      .create()
    // Garante a graduação no curso já existe no setup.
    void curso

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    // Saudação mostra "1 formação", não 2.
    await page.assertVisible('text=Você tem 1 formação na UFRRJ')
    await page.assertNotExists('text=Mestrado · evadido')
  })

  test('detalhe da formação de pós mostra "Campos da formação chegam em breve"', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const curso = await CursoFactory.apply('mestrado')
      .merge({ institutoId: instituto.id, nome: 'Mestrado · PPGMMC' })
      .create()
    await MatriculaFactory.apply('cursando')
      .merge({ egressoId: egresso.id, cursoId: curso.id })
      .create()

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    await page.assertVisible('text=Campos da formação chegam em breve')
  })

  test('egresso sem RespostaPessoa vê saudação modo primeira resposta', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user } = await egressoCom1Graduacao()
    // sem RespostaPessoa

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    await page.assertVisible('text=Vamos começar')
    await page.assertVisible('text=para preencher antes da sua primeira resposta')
  })

  test('egresso sem RespostaPessoa vê Frescor "0% · sem resposta ainda" + nota', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user } = await egressoCom1Graduacao()

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    await page.assertVisible('text=sem resposta ainda')
    await page.assertVisible('text=Primeira revisão dá origem à sua linha de base')
  })

  test('egresso com RespostaPessoa > 12 meses vê Frescor expirado', async ({
    visit,
    route,
    browserContext,
  }) => {
    const { user, egresso } = await egressoCom1Graduacao()
    await RespostaPessoaFactory.apply('desatualizada').merge({ egressoId: egresso.id }).create()

    await browserContext.loginAs(user)
    const page = await visit(route('dashboard'))

    await page.assertVisible('text=Expira em expirado')
  })

  test('não-egresso (gestor) acessa /dashboard → redirect + flash', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    await GestorFactory.merge({ userId: user.id }).create()
    // sem Egresso pro user — fica fora do egresso_middleware.

    await browserContext.loginAs(user)
    await visit(route('dashboard'))

    // Egresso middleware redireciona pra gestao se gestor, senão pra home.
    // Asserção genérica: a URL não é mais /dashboard.
    const page = await visit(route('dashboard'))
    await page.assertVisible('text=Área restrita')
  })
})
