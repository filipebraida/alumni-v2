import User from '#models/user'
import type Egresso from '#models/egresso'
import type Gestor from '#models/gestor'
import type Matricula from '#models/matricula'
import type Curso from '#models/curso'

export interface PerfilDetalhe {
  user: User
  egresso: Egresso | null
  matriculas: Matricula[]
  gestor: Gestor | null
  cursosCoordenados: Curso[]
}

/**
 * Carrega o "Perfil" do usuário autenticado, role-agnostic. A identidade
 * visível (foto, contato, IDs, privacidade) vem sempre de `User`; egresso e
 * gestor são opcionais — quem tem aparece com as seções específicas (vínculos
 * acadêmicos pro egresso; cargo + cursos coordenados pro gestor).
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
      .preload('gestor', (gestor) =>
        gestor.preload('cursos', (cursos) => cursos.preload('instituto'))
      )
      .first()

    if (!user) return null

    return {
      user,
      egresso: user.egresso ?? null,
      matriculas: user.egresso?.matriculas ?? [],
      gestor: user.gestor ?? null,
      cursosCoordenados: user.gestor?.cursos ?? [],
    }
  }
}
