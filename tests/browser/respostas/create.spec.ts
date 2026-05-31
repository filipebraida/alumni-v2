import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import { UserFactory } from '#database/factories/user_factory'
import { EgressoFactory } from '#database/factories/egresso_factory'
import { InstitutoFactory } from '#database/factories/instituto_factory'
import { CursoFactory } from '#database/factories/curso_factory'
import { MatriculaFactory } from '#database/factories/matricula_factory'
import { RespostaPessoaFactory } from '#database/factories/resposta_pessoa_factory'
import { RespostaCursoFactory } from '#database/factories/resposta_curso_factory'

test.group('RespostasController.create', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('renderiza wizard com seção Dados gerais + 1 seção por matrícula não-evadida', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const grad = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id, nome: 'Ciência da Computação' })
      .create()
    const mest = await CursoFactory.apply('mestrado')
      .merge({ institutoId: instituto.id, nome: 'Mestrado · PPGMMC' })
      .create()
    await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: grad.id })
      .create()
    await MatriculaFactory.apply('cursando')
      .merge({ egressoId: egresso.id, cursoId: mest.id })
      .create()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    await page.assertVisible('text=Dados gerais')
    await page.assertVisible('text=Ciência da Computação')
    await page.assertVisible('text=Mestrado · PPGMMC')
    await page.assertElementsCount('[data-revisao-secao]', 3)
  })

  test('pré-popula campos com valores da última resposta', async ({
    visit,
    route,
    browserContext,
  }) => {
    const user = await UserFactory.create()
    const egresso = await EgressoFactory.apply('comConsentimento')
      .merge({ userId: user.id })
      .create()
    const instituto = await InstitutoFactory.create()
    const grad = await CursoFactory.apply('graduacao').merge({ institutoId: instituto.id }).create()
    const matricula = await MatriculaFactory.apply('formada')
      .merge({ egressoId: egresso.id, cursoId: grad.id })
      .create()

    const rp = await RespostaPessoaFactory.merge({
      egressoId: egresso.id,
      empregador: 'Embrapa Solos',
      cargo: 'Engenheira',
      setor: 'pesquisa_publica',
    }).create()
    await RespostaCursoFactory.merge({
      respostaPessoaId: rp.id,
      matriculaId: matricula.id,
      faixaSalarial: 'de_9k_12k',
    }).create()

    await browserContext.loginAs(user)
    const page = await visit(route('respostas.create'))

    // Inputs renderizam com os valores da última resposta como defaults.
    await page.assertExists('input[value="Embrapa Solos"]')
    await page.assertExists('input[value="Engenheira"]')
  })
})
