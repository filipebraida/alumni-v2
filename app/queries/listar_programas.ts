import Programa from '#models/programa'
import type { ModalidadePrograma } from '#enums/modalidade_programa'
import type { PaginatorMeta } from '#queries/listar_egressos_do_curso'

export type ProgramaRow = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: ModalidadePrograma | null
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  totalCursos: number
}

export interface ListarProgramasInput {
  q?: string
  institutoId?: number
  ativo?: boolean
  page?: number
  perPage?: number
}

export interface ListarProgramasResult {
  data: ProgramaRow[]
  meta: PaginatorMeta
}

export default class ListarProgramas {
  async handle({
    q,
    institutoId,
    ativo,
    page = 1,
    perPage = 20,
  }: ListarProgramasInput = {}): Promise<ListarProgramasResult> {
    const query = Programa.query()
      .preload('instituto')
      .withCount('cursos', (cursos) => cursos.as('total_cursos'))
      .orderBy('nome', 'asc')

    if (q) {
      const like = `%${q}%`
      query.where((sub) =>
        sub.where('nome', 'like', like).orWhere('codigo', 'like', like).orWhere('sigla', 'like', like)
      )
    }
    if (institutoId !== undefined) query.where('instituto_id', institutoId)
    if (ativo !== undefined) query.where('ativo', ativo)

    const paginator = await query.paginate(page, perPage)
    const data = paginator.all().map((programa) => ({
      id: programa.id,
      codigo: programa.codigo,
      nome: programa.nome,
      sigla: programa.sigla,
      modalidade: programa.modalidade,
      ativo: programa.ativo,
      institutoId: programa.institutoId,
      institutoCodigo: programa.instituto.codigo,
      institutoNome: programa.instituto.nome,
      totalCursos: Number(programa.$extras.total_cursos ?? 0),
    }))

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
