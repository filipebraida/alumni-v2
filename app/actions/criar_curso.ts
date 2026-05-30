import Curso from '#models/curso'
import Instituto from '#models/instituto'
import type { NivelAcademico } from '#enums/nivel_academico'

export interface CriarCursoInput {
  codigo: string
  nome: string
  nivel: NivelAcademico
  institutoId: number
}

export type CriarCursoResult =
  | { status: 'criado'; curso: { id: number; nome: string } }
  | { status: 'codigo_em_uso' }
  | { status: 'instituto_inexistente' }

/** `codigo` é chave natural (SIGAA) — único entre todos os cursos. */
export default class CriarCurso {
  async handle({ codigo, nome, nivel, institutoId }: CriarCursoInput): Promise<CriarCursoResult> {
    const instituto = await Instituto.find(institutoId)
    if (!instituto) return { status: 'instituto_inexistente' as const }

    const emUso = await Curso.findBy('codigo', codigo)
    if (emUso) return { status: 'codigo_em_uso' as const }

    const curso = await Curso.create({ codigo, nome, nivel, institutoId, ativo: true })
    return { status: 'criado' as const, curso: { id: curso.id, nome: curso.nome } }
  }
}
