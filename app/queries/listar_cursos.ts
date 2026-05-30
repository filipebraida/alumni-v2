import Curso from '#models/curso'
import type { NivelAcademico } from '#enums/nivel_academico'

export type CursoRow = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  instituto: { id: number; nome: string; codigo: string }
}

export default class ListarCursos {
  async handle(): Promise<CursoRow[]> {
    const cursos = await Curso.query().preload('instituto').orderBy('nome', 'asc')

    return cursos.map((curso) => ({
      id: curso.id,
      codigo: curso.codigo,
      nome: curso.nome,
      nivel: curso.nivel,
      ativo: curso.ativo,
      instituto: {
        id: curso.instituto.id,
        nome: curso.instituto.nome,
        codigo: curso.instituto.codigo,
      },
    }))
  }
}
