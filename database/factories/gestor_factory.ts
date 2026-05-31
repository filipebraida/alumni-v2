import factory from '@adonisjs/lucid/factories'
import Gestor from '#models/gestor'
import { UserFactory } from '#database/factories/user_factory'

let counter = 0

export const GestorFactory = factory
  .define(Gestor, () => {
    counter += 1
    return {
      nomeCompleto: `Gestor Teste ${counter}`,
      cargo: 'Coordenadora',
    }
  })
  .relation('user', () => UserFactory)
  .build()
