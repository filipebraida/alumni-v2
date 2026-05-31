import Curso from '#models/curso'
import type { NivelAcademico } from '#enums/nivel_academico'
import type { PaginatorMeta } from '#queries/listar_egressos_do_curso'

export type CursoRow = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  programaId: number | null
  instituto: { id: number; nome: string; codigo: string }
}

export interface ListarCursosInput {
  q?: string
  nivel?: NivelAcademico
  institutoId?: number
  page?: number
  perPage?: number
}

export interface ListarCursosResult {
  data: CursoRow[]
  meta: PaginatorMeta
}

export default class ListarCursos {
  async handle({
    q,
    nivel,
    institutoId,
    page = 1,
    perPage = 20,
  }: ListarCursosInput = {}): Promise<ListarCursosResult> {
    const query = Curso.query().preload('instituto').orderBy('nome', 'asc')

    if (q) {
      const like = `%${q}%`
      query.where((sub) => sub.where('nome', 'like', like).orWhere('codigo', 'like', like))
    }
    if (nivel) {
      query.where('nivel', nivel)
    }
    if (institutoId) {
      query.where('instituto_id', institutoId)
    }

    const paginator = await query.paginate(page, perPage)
    const data = paginator.all().map((curso) => ({
      id: curso.id,
      codigo: curso.codigo,
      nome: curso.nome,
      nivel: curso.nivel,
      ativo: curso.ativo,
      programaId: curso.programaId,
      instituto: {
        id: curso.instituto.id,
        nome: curso.instituto.nome,
        codigo: curso.instituto.codigo,
      },
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
