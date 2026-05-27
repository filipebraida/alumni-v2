import Resposta from '#models/resposta'

export interface BuscarRespostaDoAnoInput {
  egressoId: number
  ano: number
}

/** A foto do ano = a Resposta mais recente daquele ano de referência. */
export default class BuscarRespostaDoAno {
  async handle({ egressoId, ano }: BuscarRespostaDoAnoInput): Promise<Resposta | null> {
    return Resposta.query()
      .where('egresso_id', egressoId)
      .where('ano', ano)
      .orderBy('registrada_em', 'desc')
      .orderBy('id', 'desc')
      .first()
  }
}
