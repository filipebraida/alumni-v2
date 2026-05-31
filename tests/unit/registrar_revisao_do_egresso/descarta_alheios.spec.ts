import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import RegistrarRevisaoDoEgresso from '#actions/registrar_revisao_do_egresso'
import { EgressoFactory } from '#database/factories/egresso_factory'
import { InstitutoFactory } from '#database/factories/instituto_factory'
import { CursoFactory } from '#database/factories/curso_factory'
import { MatriculaFactory } from '#database/factories/matricula_factory'

test.group('RegistrarRevisaoDoEgresso · IDs alheios', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('descarta matriculas[].id alheios silenciosamente', async ({ assert, db }) => {
    // Setup: egresso A com matrícula X; egresso B com matrícula Y; mesmo curso.
    const instituto = await InstitutoFactory.create()
    const curso = await CursoFactory.apply('graduacao')
      .merge({ institutoId: instituto.id })
      .create()

    const egressoA = await EgressoFactory.with('user').create()
    const matriculaA = await MatriculaFactory.apply('formada')
      .merge({ egressoId: egressoA.id, cursoId: curso.id })
      .create()

    const egressoB = await EgressoFactory.with('user').create()
    const matriculaB = await MatriculaFactory.apply('formada')
      .merge({ egressoId: egressoB.id, cursoId: curso.id })
      .create()

    // Action chamada como egresso A, mas payload inclui matrícula do B.
    const resultado = await new RegistrarRevisaoDoEgresso().handle({
      egressoId: egressoA.id,
      payload: {
        empregador: 'Embrapa Solos',
        cargo: 'Engenheira de Software',
        setor: 'pesquisa_publica',
        matriculas: [
          { id: matriculaA.id, faixaSalarial: 'de_6k_9k' },
          { id: matriculaB.id, faixaSalarial: 'acima_25k' },
        ],
      },
    })

    // Sem throw: action retorna a RespostaPessoa.
    assert.exists(resultado)

    // Exatamente 1 RespostaPessoa (do egresso A) e 1 RespostaCurso (matrícula A).
    await db.assertCount('respostas_pessoa', 1)
    await db.assertCount('respostas_curso', 1)
    await db.assertHas('respostas_curso', {
      matricula_id: matriculaA.id,
      faixa_salarial: 'de_6k_9k',
    })
    await db.assertMissing('respostas_curso', { matricula_id: matriculaB.id })
  })
})
