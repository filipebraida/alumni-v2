import { CursoSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Matricula from '#models/matricula'
import Gestor from '#models/gestor'

/**
 * Curso ofertado pela UFRRJ. Âncora dos vínculos de aluno (Matricula) e da
 * gestão — um gestor gere um ou mais cursos via a pivot `gestor_cursos`.
 */
export default class Curso extends CursoSchema {
  static table = 'cursos'

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  @manyToMany(() => Gestor, {
    pivotTable: 'gestor_cursos',
    pivotTimestamps: true,
  })
  declare gestores: ManyToMany<typeof Gestor>
}
