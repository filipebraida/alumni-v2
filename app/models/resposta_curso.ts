import { RespostasCursoSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RespostaPessoa from '#models/resposta_pessoa'
import Matricula from '#models/matricula'

/**
 * Campos por matrícula/ano dentro de uma foto consolidada (`RespostaPessoa`).
 * Para matrículas de graduação preenche faixa salarial / relação com a
 * formação / tempo até 1º emprego. Para pós-graduação fica identidade-só
 * (3 colunas null) nesta entrega — campos próprios entram em changes D2.
 */
export default class RespostaCurso extends RespostasCursoSchema {
  static table = 'respostas_curso'

  @belongsTo(() => RespostaPessoa)
  declare respostaPessoa: BelongsTo<typeof RespostaPessoa>

  @belongsTo(() => Matricula)
  declare matricula: BelongsTo<typeof Matricula>
}
