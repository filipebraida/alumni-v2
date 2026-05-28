// O gerador singulariza "gestores" pela regra inglesa → `GestoreSchema`.
// Aliasado aqui para o nome de domínio correto; a tabela continua `gestores`.
import { GestoreSchema as GestorSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Curso from '#models/curso'

/**
 * Perfil de gestão (1:1 com User, espelha Egresso). Mantém o User como
 * identidade pura de login; gere um ou mais Cursos via a pivot `gestor_cursos`.
 */
export default class Gestor extends GestorSchema {
  static table = 'gestores'

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Curso, {
    pivotTable: 'gestor_cursos',
    pivotTimestamps: true,
  })
  declare cursos: ManyToMany<typeof Curso>
}
