import { MatriculaSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'

/** Vínculo acadêmico (curso) de um egresso na UFRRJ. N por egresso. */
export default class Matricula extends MatriculaSchema {
  static table = 'matriculas'

  @belongsTo(() => Egresso)
  declare egresso: BelongsTo<typeof Egresso>
}
