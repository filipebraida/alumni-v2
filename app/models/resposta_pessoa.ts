import { RespostasPessoaSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'
import RespostaCurso from '#models/resposta_curso'

/**
 * Foto dos dados pessoais/profissionais do egresso num instante. Uma por
 * egresso/ano (D1 da pesquisa). Append-only: cada revisão = uma linha nova.
 * Estado atual = última registrada. Cada `RespostaPessoa` tem N filhas
 * `RespostaCurso` (uma por matrícula não-evadida no instante).
 */
export default class RespostaPessoa extends RespostasPessoaSchema {
  static table = 'respostas_pessoa'

  /**
   * Janela de frescor: uma resposta está "em dia" quando `registradaEm` cai
   * nos últimos N meses. É a régua da métrica "% preenchido no prazo".
   */
  static JANELA_FRESCOR_MESES = 12

  @belongsTo(() => Egresso)
  declare egresso: BelongsTo<typeof Egresso>

  @hasMany(() => RespostaCurso)
  declare respostasCurso: HasMany<typeof RespostaCurso>
}
