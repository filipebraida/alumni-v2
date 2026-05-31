import { DateTime } from 'luxon'
import Matricula from '#models/matricula'
import RespostaPessoa from '#models/resposta_pessoa'

export interface EstatisticasDoCursoInput {
  cursoId: number
}

export interface EstatisticasDoCursoResult {
  totalFormados: number
  emDia: number
  pct: number
}

/**
 * Métricas de frescor de um curso: do roster de formados, quantos têm uma
 * Resposta dentro da janela de frescor (RespostaPessoa.JANELA_FRESCOR_MESES).
 * População-alvo = matrículas com `situacao = 'formado'`.
 */
export default class EstatisticasDoCurso {
  async handle({ cursoId }: EstatisticasDoCursoInput): Promise<EstatisticasDoCursoResult> {
    const roster = await Matricula.query()
      .where('cursoId', cursoId)
      .where('situacao', 'formado')
      .select('egresso_id')
      .distinct()

    const egressoIds = roster.map((matricula) => matricula.egressoId)
    const totalFormados = egressoIds.length

    let emDia = 0
    if (totalFormados > 0) {
      // `registrada_em` é gravado como 'yyyy-MM-dd HH:mm:ss'; comparamos no mesmo
      // formato (string) — o query builder não serializa DateTime aqui.
      const cutoff = DateTime.now()
        .minus({ months: RespostaPessoa.JANELA_FRESCOR_MESES })
        .toFormat('yyyy-MM-dd HH:mm:ss')
      const [agg] = await RespostaPessoa.query()
        .whereIn('egressoId', egressoIds)
        .where('registradaEm', '>=', cutoff)
        .countDistinct('egresso_id as total')
      emDia = Number(agg.$extras.total)
    }

    const pct = totalFormados === 0 ? 0 : Math.round((emDia / totalFormados) * 100)
    return { totalFormados, emDia, pct }
  }
}
