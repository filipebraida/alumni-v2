import type Egresso from '#models/egresso'
import { BaseTransformer } from '@adonisjs/core/transformers'

export type EgressoPainelExtras = {
  saudacao: string
  agora: string
  campus: string
}

function iniciais(nome: string) {
  const [primeiro, segundo] = nome.trim().split(/\s+/)
  return `${primeiro?.[0] ?? ''}${segundo?.[0] ?? ''}`.toUpperCase()
}

function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0] ?? ''
}

export default class EgressoTransformer extends BaseTransformer<Egresso> {
  constructor(
    resource: Egresso,
    protected painelExtras?: EgressoPainelExtras
  ) {
    super(resource)
  }

  toObject() {
    const egresso = this.resource
    return {
      id: egresso.id,
      nome: egresso.nomeCompleto,
      primeiroNome: primeiroNome(egresso.nomeCompleto),
      iniciais: iniciais(egresso.nomeCompleto),
      verificada: !!egresso.consentimentoEm,
    }
  }

  forPainel() {
    if (!this.painelExtras) {
      throw new Error('EgressoTransformer.forPainel exige painelExtras no constructor')
    }
    return {
      ...this.toObject(),
      saudacao: this.painelExtras.saudacao,
      agora: this.painelExtras.agora,
      campus: this.painelExtras.campus,
    }
  }
}
