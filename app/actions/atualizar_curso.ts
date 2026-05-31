import Curso from '#models/curso'
import Instituto from '#models/instituto'
import Programa from '#models/programa'
import type { NivelAcademico } from '#enums/nivel_academico'

export interface AtualizarCursoInput {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  institutoId: number
  programaId?: number
  ativo: boolean
}

export type AtualizarCursoResult =
  | { status: 'atualizado'; curso: { id: number; nome: string } }
  | { status: 'inexistente' }
  | { status: 'codigo_em_uso' }
  | { status: 'instituto_inexistente' }
  | { status: 'programa_obrigatorio' }
  | { status: 'programa_inexistente' }
  | { status: 'programa_de_outro_instituto' }
  | { status: 'graduacao_sem_programa' }

export default class AtualizarCurso {
  async handle({
    id,
    codigo,
    nome,
    nivel,
    institutoId,
    programaId,
    ativo,
  }: AtualizarCursoInput): Promise<AtualizarCursoResult> {
    const curso = await Curso.find(id)
    if (!curso) return { status: 'inexistente' as const }

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

    if (codigo !== curso.codigo) {
      const colisao = await Curso.findBy('codigo', codigo)
      if (colisao && colisao.id !== id) return { status: 'codigo_em_uso' as const }
    }

    curso.merge({
      codigo,
      nome,
      nivel,
      institutoId,
      programaId: programaId ?? null,
      ativo,
    })
    await curso.save()
    return { status: 'atualizado' as const, curso: { id: curso.id, nome: curso.nome } }
  }
}
