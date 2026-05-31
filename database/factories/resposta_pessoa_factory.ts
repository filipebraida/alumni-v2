import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import RespostaPessoa from '#models/resposta_pessoa'

export const RespostaPessoaFactory = factory
  .define(RespostaPessoa, () => {
    return {
      ano: DateTime.now().year,
      registradaEm: DateTime.now(),
      localizacaoCidade: 'Rio de Janeiro',
      localizacaoUf: 'RJ',
      localizacaoPais: 'Brasil',
      empregador: 'Embrapa Solos',
      cargo: 'Engenheira de Software',
      setor: 'pesquisa_publica' as const,
      faixaSalarial: 'de_9k_12k' as const,
    }
  })
  .state('recente', (resposta) => {
    resposta.registradaEm = DateTime.now()
  })
  .state('desatualizada', (resposta) => {
    resposta.registradaEm = DateTime.now().minus({ months: 13 })
  })
  .build()
