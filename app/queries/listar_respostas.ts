import Resposta from '#models/resposta'

export interface ListarRespostasInput {
  egressoId: number
}

/** Histórico completo (trajetória), da mais recente para a mais antiga. */
export default class ListarRespostas {
  async handle({ egressoId }: ListarRespostasInput): Promise<Resposta[]> {
    return Resposta.query()
      .where('egresso_id', egressoId)
      .orderBy('registrada_em', 'desc')
      .orderBy('id', 'desc')
  }
}
