import Programa from '#models/programa'
import type { ModalidadePrograma } from '#enums/modalidade_programa'

export type ProgramaRow = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: ModalidadePrograma | null
  ativo: boolean
  institutoId: number
}

export interface ListarProgramasInput {
  institutoId?: number
  ativo?: boolean
  perPage?: number
}

export interface ListarProgramasResult {
  data: ProgramaRow[]
}

/**
 * Catálogo simples de programas (PPGs) para uso em selects. Não pagina —
 * o universo é pequeno (~45 PPGs UFRRJ).
 */
export default class ListarProgramas {
  async handle({
    institutoId,
    ativo,
    perPage = 200,
  }: ListarProgramasInput = {}): Promise<ListarProgramasResult> {
    const query = Programa.query().orderBy('nome', 'asc').limit(perPage)

    if (institutoId !== undefined) query.where('instituto_id', institutoId)
    if (ativo !== undefined) query.where('ativo', ativo)

    const programas = await query.exec()
    return {
      data: programas.map((p) => ({
        id: p.id,
        codigo: p.codigo,
        nome: p.nome,
        sigla: p.sigla,
        modalidade: p.modalidade,
        ativo: p.ativo,
        institutoId: p.institutoId,
      })),
    }
  }
}
