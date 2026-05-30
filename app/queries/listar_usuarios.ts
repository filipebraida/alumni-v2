import User from '#models/user'
import type { RoleUsuario } from '#enums/role_usuario'

export type UsuarioRow = {
  id: number
  fullName: string | null
  email: string
  role: RoleUsuario
  cursosCoordenados: { id: number; codigo: string; nome: string }[]
}

export default class ListarUsuarios {
  async handle(): Promise<UsuarioRow[]> {
    const users = await User.query()
      .preload('gestor', (gestor) =>
        gestor.preload('cursos', (cursos) => cursos.orderBy('nome', 'asc'))
      )
      .orderBy('full_name', 'asc')

    return users.map((user) => ({
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
  }
}
