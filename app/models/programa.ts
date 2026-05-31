import { ProgramaSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Instituto from '#models/instituto'
import Curso from '#models/curso'

/**
 * Programa de Pós-Graduação (PPG) — aglutinador de cursos stricto/lato sensu.
 * Um PPG agrega mestrado e doutorado sob uma mesma identidade institucional
 * (mesmo PPC, mesma área de avaliação CAPES, mesma modalidade acadêmico/profissional).
 * Coordenação fica no Curso (M e D têm coordenadores próprios), não no Programa.
 * Graduação não usa essa entidade — Curso.programaId fica null.
 */
export default class Programa extends ProgramaSchema {
  static table = 'programas'

  @belongsTo(() => Instituto)
  declare instituto: BelongsTo<typeof Instituto>

  @hasMany(() => Curso)
  declare cursos: HasMany<typeof Curso>
}
