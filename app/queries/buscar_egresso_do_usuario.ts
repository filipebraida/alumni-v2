import Egresso from '#models/egresso'

export interface BuscarEgressoDoUsuarioInput {
  userId: number
}

/** O egresso do usuário logado, com seus vínculos acadêmicos e cursos. */
export default class BuscarEgressoDoUsuario {
  async handle({ userId }: BuscarEgressoDoUsuarioInput): Promise<Egresso | null> {
    return Egresso.query()
      .where('user_id', userId)
      .preload('matriculas', (matriculas) =>
        matriculas.preload('curso', (curso) => curso.preload('instituto'))
      )
      .first()
  }
}
