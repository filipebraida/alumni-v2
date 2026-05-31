import Curso from '#models/curso'
import Instituto from '#models/instituto'
import Programa from '#models/programa'
import type { NivelAcademico } from '#enums/nivel_academico'

export interface CriarCursoInput {
  codigo: string
  nome: string
  nivel: NivelAcademico
  institutoId: number
  programaId?: number
}

export type CriarCursoResult =
  | { status: 'criado'; curso: { id: number; nome: string } }
  | { status: 'codigo_em_uso' }
  | { status: 'instituto_inexistente' }
  | { status: 'programa_obrigatorio' }
  | { status: 'programa_inexistente' }
  | { status: 'programa_de_outro_instituto' }
  | { status: 'graduacao_sem_programa' }

/**
 * `codigo` é chave natural (SIGAA) — único entre todos os cursos.
 * Para níveis ≠ graduação, exige `programaId` apontando para um programa do mesmo instituto.
 * Graduação não usa programa.
 */
export default class CriarCurso {
  async handle({
    codigo,
    nome,
    nivel,
    institutoId,
    programaId,
  }: CriarCursoInput): Promise<CriarCursoResult> {
    const instituto = await Instituto.find(institutoId)
    if (!instituto) return { status: 'instituto_inexistente' as const }

    if (nivel === 'graduacao' && programaId !== undefined) {
      return { status: 'graduacao_sem_programa' as const }
    }

    if (nivel !== 'graduacao') {
      if (programaId === undefined) return { status: 'programa_obrigatorio' as const }
      const programa = await Programa.find(programaId)
      if (!programa) return { status: 'programa_inexistente' as const }
      if (programa.institutoId !== institutoId) {
        return { status: 'programa_de_outro_instituto' as const }
      }
    }

    const emUso = await Curso.findBy('codigo', codigo)
    if (emUso) return { status: 'codigo_em_uso' as const }

    const curso = await Curso.create({
      codigo,
      nome,
      nivel,
      institutoId,
      programaId: programaId ?? null,
      ativo: true,
    })
    return { status: 'criado' as const, curso: { id: curso.id, nome: curso.nome } }
  }
}
