import type Gestor from '#models/gestor'
import { BaseTransformer } from '@adonisjs/core/transformers'
import CursoTransformer from '#transformers/curso_transformer'

export default class GestorTransformer extends BaseTransformer<Gestor> {
  toObject() {
    return this.pick(this.resource, ['id', 'cargo'])
  }

  forPerfil() {
    // `cursos` é sempre preloadado por BuscarPerfil; o `!` reflete a invariante
    return {
      cargo: this.resource.cargo,
      cursos: CursoTransformer.transform(this.whenLoaded(this.resource.cursos))!,
    }
  }
}
