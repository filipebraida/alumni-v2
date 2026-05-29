import { DateTime } from 'luxon'
import Matricula from '#models/matricula'
import Resposta from '#models/resposta'
import type { SituacaoMatricula } from '#enums/situacao_matricula'

export interface ListarEgressosDoCursoInput {
  cursoId: number
  page: number
  perPage: number
  q?: string
  situacoes?: SituacaoMatricula[]
  turma?: string
}

/** Frescor do egresso em relação à janela de atualização (Resposta). */
export type StatusFrescor = 'em_dia' | 'desatualizado' | 'sem_registro'

export interface EgressoDoCursoRow {
  egressoId: number
  nome: string
  email: string | null
  matriculaCodigo: string
  situacao: SituacaoMatricula
  periodoFormatura: string | null
  consentiu: boolean
  ultimaAtualizacao: string | null
  status: StatusFrescor
  cargo: string | null
  empregador: string | null
}

export interface PaginatorMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface ListarEgressosDoCursoResult {
  data: EgressoDoCursoRow[]
  meta: PaginatorMeta
}

/**
 * Roster de egressos de um curso para a gestão analisar, paginado e filtrado no
 * servidor: uma linha por matrícula no curso (formado/cursando por padrão), com
 * o status de frescor derivado da Resposta mais recente do egresso. A busca (`q`)
 * casa nome, e-mail de contato e código da matrícula.
 */
export default class ListarEgressosDoCurso {
  async handle({
    cursoId,
    page,
    perPage,
    q,
    situacoes,
    turma,
  }: ListarEgressosDoCursoInput): Promise<ListarEgressosDoCursoResult> {
    const situacoesAlvo = situacoes?.length ? situacoes : ['formado', 'cursando']

    const query = Matricula.query()
      .where('cursoId', cursoId)
      .whereIn('situacao', situacoesAlvo)
      .preload('egresso', (egresso) => egresso.preload('user'))

    if (turma) {
      query.where('periodoFormatura', turma)
    }

    if (q) {
      const like = `%${q}%`
      query.where((sub) => {
        sub.where('codigo', 'like', like).orWhereHas('egresso', (egresso) => {
          egresso.where('nomeCompleto', 'like', like).orWhere('emailPessoal', 'like', like)
        })
      })
    }

    const paginator = await query
      .orderBy('situacao', 'asc')
      .orderBy('id', 'asc')
      .paginate(page, perPage)
    const matriculas = paginator.all()

    // Última Resposta apenas dos egressos desta página: carregamos os pares
    // (egresso, registradaEm) e reduzimos como DateTime, sem depender do formato
    // bruto da coluna no banco.
    const egressoIds = [...new Set(matriculas.map((matricula) => matricula.egressoId))]
    const ultimaPorEgresso = new Map<
      number,
      { registradaEm: DateTime; cargo: string | null; empregador: string | null }
    >()
    if (egressoIds.length > 0) {
      const respostas = await Resposta.query()
        .whereIn('egressoId', egressoIds)
        .select('egressoId', 'registradaEm', 'cargo', 'empregador')
      for (const resposta of respostas) {
        const atual = ultimaPorEgresso.get(resposta.egressoId)
        if (!atual || resposta.registradaEm > atual.registradaEm) {
          ultimaPorEgresso.set(resposta.egressoId, {
            registradaEm: resposta.registradaEm,
            cargo: resposta.cargo,
            empregador: resposta.empregador,
          })
        }
      }
    }

    const cutoff = DateTime.now().minus({ months: Resposta.JANELA_FRESCOR_MESES })

    const data: EgressoDoCursoRow[] = matriculas.map((matricula) => {
      const egresso = matricula.egresso
      const ultima = ultimaPorEgresso.get(matricula.egressoId) ?? null
      const status: StatusFrescor = !ultima
        ? 'sem_registro'
        : ultima.registradaEm >= cutoff
          ? 'em_dia'
          : 'desatualizado'

      return {
        egressoId: matricula.egressoId,
        nome: egresso.nomeCompleto,
        email: egresso.emailPessoal ?? egresso.user?.email ?? null,
        matriculaCodigo: matricula.codigo,
        situacao: matricula.situacao,
        periodoFormatura: matricula.periodoFormatura,
        consentiu: !!egresso.consentimentoEm,
        ultimaAtualizacao: ultima?.registradaEm.toISODate() ?? null,
        status,
        cargo: ultima?.cargo ?? null,
        empregador: ultima?.empregador ?? null,
      }
    })

    const meta = paginator.getMeta()
    return {
      data,
      meta: {
        total: meta.total,
        perPage: meta.perPage,
        currentPage: meta.currentPage,
        lastPage: meta.lastPage,
        firstPage: meta.firstPage,
      },
    }
  }
}

/** Página vazia (sem curso ativo) preservando o contrato da listagem. */
export function rosterVazio(perPage = 10): ListarEgressosDoCursoResult {
  return {
    data: [],
    meta: { total: 0, perPage, currentPage: 1, lastPage: 1, firstPage: 1 },
  }
}
