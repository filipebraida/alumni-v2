import Matricula from '#models/matricula'

export interface ListarTurmasDoCursoInput {
  cursoId: number
}

/**
 * Turmas (períodos de formatura, formato `AAAA.S`) presentes no roster de um
 * curso, do mais recente ao mais antigo. Alimenta o filtro de turma da gestão.
 */
export default class ListarTurmasDoCurso {
  async handle({ cursoId }: ListarTurmasDoCursoInput): Promise<string[]> {
    const linhas = await Matricula.query()
      .where('cursoId', cursoId)
      .whereNotNull('periodoFormatura')
      .distinct('periodoFormatura')
      .orderBy('periodoFormatura', 'desc')

    return linhas.map((linha) => linha.periodoFormatura).filter((turma): turma is string => !!turma)
  }
}
