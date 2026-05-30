import Curso from '#models/curso'

export default class ListarTodosOsCursos {
  async handle(): Promise<Curso[]> {
    return Curso.query().preload('instituto').orderBy('nome', 'asc')
  }
}
