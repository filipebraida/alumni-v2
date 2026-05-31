import Programa from '#models/programa'

export interface RemoverProgramaInput {
  id: number
}

export type RemoverProgramaResult =
  | { status: 'removido' }
  | { status: 'inexistente' }
  | { status: 'tem_dependencias'; cursos: number }

export default class RemoverPrograma {
  async handle({ id }: RemoverProgramaInput): Promise<RemoverProgramaResult> {
    const programa = await Programa.query()
      .where('id', id)
      .withCount('cursos', (q) => q.as('total_cursos'))
      .first()
    if (!programa) return { status: 'inexistente' as const }

    const cursos = Number(programa.$extras.total_cursos ?? 0)
    if (cursos > 0) return { status: 'tem_dependencias' as const, cursos }

    await programa.delete()
    return { status: 'removido' as const }
  }
}
