import Instituto from '#models/instituto'
import type { NivelAcademico } from '#enums/nivel_academico'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export type InstitutoCursoBreve = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
}

export type InstitutoProgramaBreve = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: ModalidadePrograma | null
  ativo: boolean
}

export type InstitutoDetalhe = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
  totalProgramas: number
  cursos: InstitutoCursoBreve[]
  programas: InstitutoProgramaBreve[]
}

export interface BuscarInstitutoInput {
  id: number
}

/** Detalhe completo pra página show, com listinhas resumidas de cursos e programas. */
export default class BuscarInstituto {
  async handle({ id }: BuscarInstitutoInput): Promise<InstitutoDetalhe | null> {
    const instituto = await Instituto.query()
      .where('id', id)
      .preload('cursos', (q) => q.orderBy('nome', 'asc'))
      .preload('programas', (q) => q.orderBy('nome', 'asc'))
      .first()
    if (!instituto) return null

    return {
      id: instituto.id,
      codigo: instituto.codigo,
      nome: instituto.nome,
      ativo: instituto.ativo,
      totalCursos: instituto.cursos.length,
      totalProgramas: instituto.programas.length,
      cursos: instituto.cursos.map((c) => ({
        id: c.id,
        codigo: c.codigo,
        nome: c.nome,
        nivel: c.nivel,
        ativo: c.ativo,
      })),
      programas: instituto.programas.map((p) => ({
        id: p.id,
        codigo: p.codigo,
        nome: p.nome,
        sigla: p.sigla,
        modalidade: p.modalidade,
        ativo: p.ativo,
      })),
    }
  }
}
