import factory from '@adonisjs/lucid/factories'
import Instituto from '#models/instituto'

let counter = 0

export const InstitutoFactory = factory
  .define(Instituto, () => {
    counter += 1
    const sufixo = `${counter}-${Date.now()}`
    return {
      codigo: `inst-${sufixo}`,
      nome: `Instituto de Teste ${counter}`,
    }
  })
  .build()
