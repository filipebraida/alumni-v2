import Instituto from '#models/instituto'

export type InstitutoRow = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
}

export default class ListarInstitutos {
  async handle(): Promise<InstitutoRow[]> {
    const institutos = await Instituto.query()
      .withCount('cursos', (query) => query.as('total_cursos'))
      .orderBy('nome', 'asc')

    return institutos.map((instituto) => ({
      id: instituto.id,
      codigo: instituto.codigo,
      nome: instituto.nome,
      ativo: instituto.ativo,
      totalCursos: Number(instituto.$extras.total_cursos ?? 0),
    }))
  }
}
