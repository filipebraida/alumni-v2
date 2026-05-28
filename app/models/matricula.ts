import { MatriculaSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'
import Curso from '#models/curso'

/** Vínculo acadêmico de um egresso a um Curso da UFRRJ. N por egresso. */
export default class Matricula extends MatriculaSchema {
  static table = 'matriculas'

  @belongsTo(() => Egresso)
  declare egresso: BelongsTo<typeof Egresso>

  @belongsTo(() => Curso)
  declare curso: BelongsTo<typeof Curso>
}
