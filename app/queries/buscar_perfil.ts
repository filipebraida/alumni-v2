import User from '#models/user'
import type Egresso from '#models/egresso'
import type Matricula from '#models/matricula'

export interface PerfilDetalhe {
  user: User
  egresso: Egresso
  matriculas: Matricula[]
}

/**
 * Carrega os dados do "Perfil" do egresso autenticado: o `User` para o
 * e-mail de login + role, o `Egresso` para nome/CPF/e-mail pessoal e todas as
 * matrículas com curso e instituto (lista de vínculos acadêmicos).
 */
export default class BuscarPerfil {
  async handle(userId: number): Promise<PerfilDetalhe | null> {
    const user = await User.query()
      .where('id', userId)
      .preload('egresso', (egresso) =>
        egresso.preload('matriculas', (matriculas) =>
          matriculas
            .preload('curso', (curso) => curso.preload('instituto'))
            .orderBy('createdAt', 'desc')
        )
      )
      .first()

    if (!user || !user.egresso) return null

    return { user, egresso: user.egresso, matriculas: user.egresso.matriculas }
  }
}
