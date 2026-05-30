import { InstitutoSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Curso from '#models/curso'

/** Instituto da UFRRJ — unidade/campus que agrupa cursos. */
export default class Instituto extends InstitutoSchema {
  static table = 'institutos'

  @hasMany(() => Curso)
  declare cursos: HasMany<typeof Curso>
}
