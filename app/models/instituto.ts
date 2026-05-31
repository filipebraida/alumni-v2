import { InstitutoSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Curso from '#models/curso'
import Programa from '#models/programa'

/** Instituto da UFRRJ — unidade/campus que agrupa cursos e programas. */
export default class Instituto extends InstitutoSchema {
  static table = 'institutos'

  @hasMany(() => Curso)
  declare cursos: HasMany<typeof Curso>

  @hasMany(() => Programa)
  declare programas: HasMany<typeof Programa>
}
