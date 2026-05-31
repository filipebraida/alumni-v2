import RespostaPessoa from '#models/resposta_pessoa'

export interface BuscarUltimaRespostaPessoaDoEgressoInput {
  egressoId: number
}

/** A foto pessoal mais recente do egresso, ou null se ele nunca respondeu. */
export default class BuscarUltimaRespostaPessoaDoEgresso {
  async handle({
    egressoId,
  }: BuscarUltimaRespostaPessoaDoEgressoInput): Promise<RespostaPessoa | null> {
    return RespostaPessoa.query()
      .where('egresso_id', egressoId)
      .orderBy('registrada_em', 'desc')
      .first()
  }
}
