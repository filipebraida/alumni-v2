import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import RespostaCurso from '#models/resposta_curso'

export const RespostaCursoFactory = factory
  .define(RespostaCurso, () => {
    return {
      ano: DateTime.now().year,
      relacaoFormacao: 'total' as const,
      tempoPrimeiroEmprego: 'ate_3m' as const,
    }
  })
  .state('paraPos', (resposta) => {
    // Pós-graduação: identidade-só nesta entrega — as 2 colunas de graduação
    // ficam null por construção.
    resposta.relacaoFormacao = null
    resposta.tempoPrimeiroEmprego = null
  })
  .build()
