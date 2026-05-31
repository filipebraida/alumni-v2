import type Curso from '#models/curso'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { NIVEL_LABELS } from '#enums/nivel_academico'

export default class CursoTransformer extends BaseTransformer<Curso> {
  toObject() {
    return {
      id: this.resource.id,
      nome: this.resource.nome,
      codigo: this.resource.codigo,
      nivel: NIVEL_LABELS[this.resource.nivel],
      instituto: this.resource.instituto?.nome ?? '—',
    }
  }
}
