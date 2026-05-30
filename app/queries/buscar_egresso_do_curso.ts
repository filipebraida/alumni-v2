import { DateTime } from 'luxon'
import Egresso from '#models/egresso'
import Resposta from '#models/resposta'
import type Matricula from '#models/matricula'

export type StatusFrescor = 'em_dia' | 'desatualizado' | 'sem_registro'

export interface BuscarEgressoDoCursoInput {
  egressoId: number
  cursoId: number
}

export interface EgressoDoCursoDetalhe {
  egresso: Egresso
  matricula: Matricula
  respostaAtual: Resposta | null
  statusFrescor: StatusFrescor
}

/**
 * Tenancy: só retorna o egresso se ele tiver matrícula no curso ativo. Quem
 * coordena outro curso não enxerga dados de fora do seu roster.
 */
export default class BuscarEgressoDoCurso {
  async handle({
    egressoId,
    cursoId,
  }: BuscarEgressoDoCursoInput): Promise<EgressoDoCursoDetalhe | null> {
    const egresso = await Egresso.query()
      .where('id', egressoId)
      .preload('user')
      .preload('matriculas', (matriculas) =>
        matriculas
          .where('cursoId', cursoId)
          .preload('curso', (curso) => curso.preload('instituto'))
      )
      .preload('respostas', (respostas) => respostas.orderBy('registradaEm', 'desc').limit(1))
      .first()

    const matricula = egresso?.matriculas[0]
    if (!egresso || !matricula) return null

    const respostaAtual = egresso.respostas[0] ?? null
    const cutoff = DateTime.now().minus({ months: Resposta.JANELA_FRESCOR_MESES })
    const statusFrescor: StatusFrescor = !respostaAtual
      ? 'sem_registro'
      : respostaAtual.registradaEm >= cutoff
        ? 'em_dia'
        : 'desatualizado'

    return { egresso, matricula, respostaAtual, statusFrescor }
  }
}
