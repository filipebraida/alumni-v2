import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import Egresso from '#models/egresso'
import { UserFactory } from '#database/factories/user_factory'

let counter = 0

export const EgressoFactory = factory
  .define(Egresso, () => {
    counter += 1
    const sufixo = `${counter}-${Date.now()}`
    return {
      cpf: `cpf-${sufixo}`,
      nomeCompleto: `Egresso Teste ${counter}`,
      emailPessoal: null,
      consentimentoEm: null,
    }
  })
  .relation('user', () => UserFactory)
  .state('comConsentimento', (egresso) => {
    egresso.consentimentoEm = DateTime.now()
  })
  .build()
