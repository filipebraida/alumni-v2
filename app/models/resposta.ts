import { RespostaSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'

/**
 * Foto dos 8 campos MEC num momento. Append-only: cada confirmação/atualização
 * é uma nova linha. Estado atual = última; foto do ano = última com `ano = X`.
 */
export default class Resposta extends RespostaSchema {
  static table = 'respostas'

  @belongsTo(() => Egresso)
  declare egresso: BelongsTo<typeof Egresso>
}
