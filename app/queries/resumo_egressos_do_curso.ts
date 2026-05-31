import { DateTime } from 'luxon'
import Matricula from '#models/matricula'
import RespostaPessoa from '#models/resposta_pessoa'

export interface ResumoEgressosDoCursoInput {
  cursoId: number
}

export interface ResumoEgressosDoCursoResult {
  total: number
  emDia: number
  desatualizado: number
  semRegistro: number
  pctEmDia: number
  janelaFrescorMeses: number
}

/**
 * Métricas de frescor do roster de um curso, sobre a mesma população da listagem
 * (matrículas `formado`/`cursando`): cada egresso é classificado pela Resposta
 * mais recente em em_dia | desatualizado | sem_registro. Alimenta os cards de
 * estatística da tela de egressos da gestão.
 */
export default class ResumoEgressosDoCurso {
  async handle({ cursoId }: ResumoEgressosDoCursoInput): Promise<ResumoEgressosDoCursoResult> {
    const janelaFrescorMeses = RespostaPessoa.JANELA_FRESCOR_MESES

    const matriculas = await Matricula.query()
      .where('cursoId', cursoId)
      .whereIn('situacao', ['formado', 'cursando'])
      .select('id', 'egresso_id')

    const total = matriculas.length
    if (total === 0) {
      return {
        total: 0,
        emDia: 0,
        desatualizado: 0,
        semRegistro: 0,
        pctEmDia: 0,
        janelaFrescorMeses,
      }
    }

    const egressoIds = [...new Set(matriculas.map((matricula) => matricula.egressoId))]
    const ultimaPorEgresso = new Map<number, DateTime>()
    const respostas = await RespostaPessoa.query()
      .whereIn('egressoId', egressoIds)
      .select('egressoId', 'registradaEm')
    for (const resposta of respostas) {
      const atual = ultimaPorEgresso.get(resposta.egressoId)
      if (!atual || resposta.registradaEm > atual) {
        ultimaPorEgresso.set(resposta.egressoId, resposta.registradaEm)
      }
    }

    const cutoff = DateTime.now().minus({ months: janelaFrescorMeses })
    let emDia = 0
    let desatualizado = 0
    let semRegistro = 0
    for (const matricula of matriculas) {
      const ultima = ultimaPorEgresso.get(matricula.egressoId) ?? null
      if (!ultima) semRegistro++
      else if (ultima >= cutoff) emDia++
      else desatualizado++
    }

    const pctEmDia = Math.round((emDia / total) * 100)
    return { total, emDia, desatualizado, semRegistro, pctEmDia, janelaFrescorMeses }
  }
}
