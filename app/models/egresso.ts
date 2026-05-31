import { EgressoSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Matricula from '#models/matricula'
import RespostaPessoa from '#models/resposta_pessoa'

/**
 * Egresso = a pessoa (1:1 com User). Guarda só a identidade acadêmica; os
 * vínculos de curso ficam em Matricula e o histórico de fotos em
 * RespostaPessoa (com filhas RespostaCurso por matrícula no instante).
 */
export default class Egresso extends EgressoSchema {
  static table = 'egressos'

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Matricula)
  declare matriculas: HasMany<typeof Matricula>

  @hasMany(() => RespostaPessoa)
  declare respostasPessoa: HasMany<typeof RespostaPessoa>
}
