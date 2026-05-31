import type Curso from '#models/curso'
import { BaseTransformer } from '@adonisjs/core/transformers'
import CursoTransformer from '#transformers/curso_transformer'

export type GestaoSharedSource = {
  cursoAtivoId: number | null
  isAdmin: boolean
  cursos: Curso[]
}

export default class GestaoSharedTransformer extends BaseTransformer<GestaoSharedSource> {
  toObject() {
    return {
      cursoAtivoId: this.resource.cursoAtivoId,
      isAdmin: this.resource.isAdmin,
      cursos: CursoTransformer.transform(this.resource.cursos),
    }
  }
}
