import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import RespostaCurso from '#models/resposta_curso'

export const RespostaCursoFactory = factory
  .define(RespostaCurso, () => {
    return {
      ano: DateTime.now().year,
      faixaSalarial: 'de_9k_12k' as const,
      relacaoFormacao: 'total' as const,
      tempoPrimeiroEmprego: 'ate_3m' as const,
    }
  })
  .state('paraPos', (resposta) => {
    // Pós-graduação: identidade-só nesta entrega — todas as 3 colunas de
    // graduação ficam null por construção.
    resposta.faixaSalarial = null
    resposta.relacaoFormacao = null
    resposta.tempoPrimeiroEmprego = null
  })
  .build()
