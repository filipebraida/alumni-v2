import Instituto from '#models/instituto'
import type { PaginatorMeta } from '#queries/listar_egressos_do_curso'

export type InstitutoRow = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
}

export interface ListarInstitutosInput {
  q?: string
  page?: number
  perPage?: number
}

export interface ListarInstitutosResult {
  data: InstitutoRow[]
  meta: PaginatorMeta
}

export default class ListarInstitutos {
  async handle({
    q,
    page = 1,
    perPage = 20,
  }: ListarInstitutosInput = {}): Promise<ListarInstitutosResult> {
    const query = Instituto.query()
      .withCount('cursos', (cursos) => cursos.as('total_cursos'))
      .orderBy('nome', 'asc')

    if (q) {
      const like = `%${q}%`
      query.where((sub) => sub.where('nome', 'like', like).orWhere('codigo', 'like', like))
    }

    const paginator = await query.paginate(page, perPage)
    const data = paginator.all().map((instituto) => ({
      id: instituto.id,
      codigo: instituto.codigo,
      nome: instituto.nome,
      ativo: instituto.ativo,
      totalCursos: Number(instituto.$extras.total_cursos ?? 0),
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
