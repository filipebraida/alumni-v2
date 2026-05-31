import Programa from '#models/programa'
import type { NivelAcademico } from '#enums/nivel_academico'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export type ProgramaCursoBreve = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
}

export type ProgramaDetalhe = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: ModalidadePrograma | null
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  totalCursos: number
  cursos: ProgramaCursoBreve[]
}

export interface BuscarProgramaInput {
  id: number
}

export default class BuscarPrograma {
  async handle({ id }: BuscarProgramaInput): Promise<ProgramaDetalhe | null> {
    const programa = await Programa.query()
      .where('id', id)
      .preload('instituto')
      .preload('cursos', (q) => q.orderBy('nome', 'asc'))
      .first()
    if (!programa) return null

    return {
      id: programa.id,
      codigo: programa.codigo,
      nome: programa.nome,
      sigla: programa.sigla,
      modalidade: programa.modalidade,
      ativo: programa.ativo,
      institutoId: programa.institutoId,
      institutoCodigo: programa.instituto.codigo,
      institutoNome: programa.instituto.nome,
      totalCursos: programa.cursos.length,
      cursos: programa.cursos.map((c) => ({
        id: c.id,
        codigo: c.codigo,
        nome: c.nome,
        nivel: c.nivel,
        ativo: c.ativo,
      })),
    }
  }
}
