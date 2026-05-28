import Gestor from '#models/gestor'

export interface BuscarGestorDoUsuarioInput {
  userId: number
}

/** O gestor do usuário logado, com os cursos que ele gere (ordenados por nome). */
export default class BuscarGestorDoUsuario {
  async handle({ userId }: BuscarGestorDoUsuarioInput): Promise<Gestor | null> {
    return Gestor.query()
      .where('user_id', userId)
      .preload('cursos', (cursos) => cursos.orderBy('nome', 'asc'))
      .first()
  }
}
