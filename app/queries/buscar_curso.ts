import Curso from '#models/curso'
import type { NivelAcademico } from '#enums/nivel_academico'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export type CursoCoordenadorBreve = {
  id: number
  nomeCompleto: string
  cargo: string | null
  email: string
}

export type CursoDetalhe = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  programa: {
    id: number
    codigo: string
    nome: string
    sigla: string | null
    modalidade: ModalidadePrograma | null
  } | null
  totalMatriculas: number
  coordenadores: CursoCoordenadorBreve[]
}

export interface BuscarCursoInput {
  id: number
}

export default class BuscarCurso {
  async handle({ id }: BuscarCursoInput): Promise<CursoDetalhe | null> {
    const curso = await Curso.query()
      .where('id', id)
      .preload('instituto')
      .preload('programa')
      .preload('gestores', (q) => q.orderBy('nomeCompleto', 'asc').preload('user'))
      .withCount('matriculas', (q) => q.as('total_matriculas'))
      .first()
    if (!curso) return null

    return {
      id: curso.id,
      codigo: curso.codigo,
      nome: curso.nome,
      nivel: curso.nivel,
      ativo: curso.ativo,
      institutoId: curso.institutoId,
      institutoCodigo: curso.instituto.codigo,
      institutoNome: curso.instituto.nome,
      programa: curso.programa
        ? {
            id: curso.programa.id,
            codigo: curso.programa.codigo,
            nome: curso.programa.nome,
            sigla: curso.programa.sigla,
            modalidade: curso.programa.modalidade,
          }
        : null,
      totalMatriculas: Number(curso.$extras.total_matriculas ?? 0),
      coordenadores: curso.gestores.map((g) => ({
        id: g.id,
        nomeCompleto: g.nomeCompleto,
        cargo: g.cargo,
        email: g.user?.email ?? '',
      })),
    }
  }
}
