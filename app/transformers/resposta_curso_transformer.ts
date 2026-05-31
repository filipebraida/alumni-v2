import type RespostaCurso from '#models/resposta_curso'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class RespostaCursoTransformer extends BaseTransformer<RespostaCurso> {
  toObject() {
    return this.pick(this.resource, ['relacaoFormacao', 'tempoPrimeiroEmprego'])
  }
}
