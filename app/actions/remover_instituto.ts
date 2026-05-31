import Instituto from '#models/instituto'

export interface RemoverInstitutoInput {
  id: number
}

export type RemoverInstitutoResult =
  | { status: 'removido' }
  | { status: 'inexistente' }
  | { status: 'tem_dependencias'; cursos: number; programas: number }

/**
 * Hard delete protegido: bloqueia se houver cursos ou programas vinculados.
 * Mensagem amigável vem do controller; aqui só carregamos os counts.
 */
export default class RemoverInstituto {
  async handle({ id }: RemoverInstitutoInput): Promise<RemoverInstitutoResult> {
    const instituto = await Instituto.query()
      .where('id', id)
      .withCount('cursos', (q) => q.as('total_cursos'))
      .withCount('programas', (q) => q.as('total_programas'))
      .first()
    if (!instituto) return { status: 'inexistente' as const }

    const cursos = Number(instituto.$extras.total_cursos ?? 0)
    const programas = Number(instituto.$extras.total_programas ?? 0)
    if (cursos > 0 || programas > 0) {
      return { status: 'tem_dependencias' as const, cursos, programas }
    }

    await instituto.delete()
    return { status: 'removido' as const }
  }
}
