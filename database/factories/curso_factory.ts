import factory from '@adonisjs/lucid/factories'
import Curso from '#models/curso'
import { InstitutoFactory } from '#database/factories/instituto_factory'

let counter = 0

export const CursoFactory = factory
  .define(Curso, () => {
    counter += 1
    const sufixo = `${counter}-${Date.now()}`
    return {
      codigo: `curso-${sufixo}`,
      nome: `Bacharelado em Ciência da Computação ${counter}`,
      nivel: 'graduacao' as const,
      ativo: true,
      programaId: null,
    }
  })
  .relation('instituto', () => InstitutoFactory)
  .state('graduacao', (curso) => {
    curso.nivel = 'graduacao'
  })
  .state('mestrado', (curso) => {
    curso.nivel = 'mestrado'
  })
  .build()
