import Resposta from '#models/resposta'

export interface BuscarRespostaAtualInput {
  egressoId: number
}

/** Estado atual dos 8 campos = a Resposta mais recente do egresso. */
export default class BuscarRespostaAtual {
  async handle({ egressoId }: BuscarRespostaAtualInput): Promise<Resposta | null> {
    return Resposta.query()
      .where('egresso_id', egressoId)
      .orderBy('registrada_em', 'desc')
      .orderBy('id', 'desc')
      .first()
  }
}
