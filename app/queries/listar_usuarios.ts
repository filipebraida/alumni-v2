import User from '#models/user'
import type { RoleUsuario } from '#enums/role_usuario'
import type { TipoFiltroUsuario } from '#validators/admin'
import type { PaginatorMeta } from '#queries/listar_egressos_do_curso'

export type UsuarioRow = {
  id: number
  fullName: string | null
  email: string
  role: RoleUsuario
  cursosCoordenados: { id: number; codigo: string; nome: string }[]
}

export interface ListarUsuariosInput {
  q?: string
  tipo?: TipoFiltroUsuario
  page?: number
  perPage?: number
}

export interface ListarUsuariosResult {
  data: UsuarioRow[]
  meta: PaginatorMeta
}

export default class ListarUsuarios {
  async handle({
    q,
    tipo,
    page = 1,
    perPage = 20,
  }: ListarUsuariosInput = {}): Promise<ListarUsuariosResult> {
    const query = User.query()
      .preload('gestor', (gestor) =>
        gestor.preload('cursos', (cursos) => cursos.orderBy('nome', 'asc'))
      )
      .orderBy('full_name', 'asc')

    if (q) {
      const like = `%${q}%`
      query.where((sub) => sub.where('full_name', 'like', like).orWhere('email', 'like', like))
    }

    if (tipo === 'admin') {
      query.where('role', 'admin')
    } else if (tipo === 'coordenador') {
      query.whereHas('gestor', (gestor) => gestor.has('cursos'))
    } else if (tipo === 'sem_papel') {
      query
        .where('role', 'usuario')
        .where((sub) => sub.whereDoesntHave('gestor', (gestor) => gestor.has('cursos')))
    }

    const paginator = await query.paginate(page, perPage)
    const data = paginator.all().map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      cursosCoordenados:
        user.gestor?.cursos.map((curso) => ({
          id: curso.id,
          codigo: curso.codigo,
          nome: curso.nome,
        })) ?? [],
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
