import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import Matricula from '#models/matricula'

let counter = 0

export const MatriculaFactory = factory
  .define(Matricula, () => {
    counter += 1
    const sufixo = `${counter}-${Date.now()}`
    return {
      codigo: `mat-${sufixo}`,
      situacao: 'cursando' as const,
      periodoFormatura: null,
      dataColacao: null,
      dataIngresso: null,
    }
  })
  .state('formada', (matricula) => {
    matricula.situacao = 'formado'
    matricula.periodoFormatura = '2022.2'
    matricula.dataIngresso = DateTime.fromISO('2018-03-01')
  })
  .state('cursando', (matricula) => {
    matricula.situacao = 'cursando'
    matricula.dataIngresso = DateTime.fromISO('2024-03-01')
  })
  .state('evadida', (matricula) => {
    matricula.situacao = 'evadido'
  })
  .build()
