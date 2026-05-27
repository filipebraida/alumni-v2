import CodigoAcesso from '#models/codigo_acesso'

export interface BuscarUltimoCodigoAcessoInput {
  email: string
}

/**
 * O código de acesso não usado mais recente do e-mail, independente de
 * expiração. As checagens de expiração e tentativas ficam na action de
 * verificação, para distinguir código expirado de código inválido.
 */
export default class BuscarUltimoCodigoAcesso {
  async handle({ email }: BuscarUltimoCodigoAcessoInput): Promise<CodigoAcesso | null> {
    return CodigoAcesso.query()
      .where('email', email)
      .whereNull('used_at')
      .orderBy('created_at', 'desc')
      .first()
  }
}
