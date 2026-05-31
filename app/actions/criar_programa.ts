import Instituto from '#models/instituto'
import Programa from '#models/programa'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export interface CriarProgramaInput {
  codigo: string
  nome: string
  sigla?: string | null
  modalidade?: ModalidadePrograma | null
  institutoId: number
}

export type CriarProgramaResult =
  | { status: 'criado'; programa: { id: number; nome: string } }
  | { status: 'codigo_em_uso' }
  | { status: 'instituto_inexistente' }

/** `codigo` é chave natural (PPGIHD, etc.) — único entre todos os programas. */
export default class CriarPrograma {
  async handle({
    codigo,
    nome,
    sigla,
    modalidade,
    institutoId,
  }: CriarProgramaInput): Promise<CriarProgramaResult> {
    const instituto = await Instituto.find(institutoId)
    if (!instituto) return { status: 'instituto_inexistente' as const }

    const emUso = await Programa.findBy('codigo', codigo)
    if (emUso) return { status: 'codigo_em_uso' as const }

    const programa = await Programa.create({
      codigo,
      nome,
      sigla: sigla ?? null,
      modalidade: modalidade ?? null,
      institutoId,
      ativo: true,
    })
    return { status: 'criado' as const, programa: { id: programa.id, nome: programa.nome } }
  }
}
