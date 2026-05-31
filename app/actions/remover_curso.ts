import Curso from '#models/curso'

export interface RemoverCursoInput {
  id: number
}

export type RemoverCursoResult =
  | { status: 'removido' }
  | { status: 'inexistente' }
  | { status: 'tem_dependencias'; matriculas: number; coordenadores: number }

export default class RemoverCurso {
  async handle({ id }: RemoverCursoInput): Promise<RemoverCursoResult> {
    const curso = await Curso.query()
      .where('id', id)
      .withCount('matriculas', (q) => q.as('total_matriculas'))
      .withCount('gestores', (q) => q.as('total_gestores'))
      .first()
    if (!curso) return { status: 'inexistente' as const }

    const matriculas = Number(curso.$extras.total_matriculas ?? 0)
    const coordenadores = Number(curso.$extras.total_gestores ?? 0)
    if (matriculas > 0 || coordenadores > 0) {
      return { status: 'tem_dependencias' as const, matriculas, coordenadores }
    }

    await curso.delete()
    return { status: 'removido' as const }
  }
}
