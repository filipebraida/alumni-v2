import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

let counter = 0

export const UserFactory = factory
  .define(User, () => {
    counter += 1
    const sufixo = `${counter}-${Date.now()}`
    return {
      email: `egresso-${sufixo}@example.com`,
      fullName: `Egresso Teste ${counter}`,
    }
  })
  .build()
