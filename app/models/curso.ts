import { CursoSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Matricula from '#models/matricula'
import Gestor from '#models/gestor'
import Instituto from '#models/instituto'

/**
 * Curso ofertado pela UFRRJ. Âncora dos vínculos de aluno (Matricula) e da
 * gestão — um gestor gere um ou mais cursos via a pivot `gestor_cursos`.
 */
export default class Curso extends CursoSchema {
  static table = 'cursos'

  @belongsTo(() => Instituto)
  declare instituto: BelongsTo<typeof Instituto>

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  @manyToMany(() => Gestor, {
    pivotTable: 'gestor_cursos',
    pivotTimestamps: true,
  })
  declare gestores: ManyToMany<typeof Gestor>
}
