import Programa from '#models/programa'
import Instituto from '#models/instituto'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export interface AtualizarProgramaInput {
  id: number
  codigo: string
  nome: string
  sigla?: string | null
  modalidade?: ModalidadePrograma | null
  institutoId: number
  ativo: boolean
}

export type AtualizarProgramaResult =
  | { status: 'atualizado'; programa: { id: number; nome: string } }
  | { status: 'inexistente' }
  | { status: 'codigo_em_uso' }
  | { status: 'instituto_inexistente' }

export default class AtualizarPrograma {
  async handle({
    id,
    codigo,
    nome,
    sigla,
    modalidade,
    institutoId,
    ativo,
  }: AtualizarProgramaInput): Promise<AtualizarProgramaResult> {
    const programa = await Programa.find(id)
    if (!programa) return { status: 'inexistente' as const }

    const instituto = await Instituto.find(institutoId)
    if (!instituto) return { status: 'instituto_inexistente' as const }

    if (codigo !== programa.codigo) {
      const colisao = await Programa.findBy('codigo', codigo)
      if (colisao && colisao.id !== id) return { status: 'codigo_em_uso' as const }
    }

    programa.merge({
      codigo,
      nome,
      sigla: sigla ?? null,
      modalidade: modalidade ?? null,
      institutoId,
      ativo,
    })
    await programa.save()
    return { status: 'atualizado' as const, programa: { id: programa.id, nome: programa.nome } }
  }
}
