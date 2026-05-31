import type Egresso from '#models/egresso'
import { BaseTransformer } from '@adonisjs/core/transformers'

function iniciais(nome: string) {
  const [primeiro, segundo] = nome.trim().split(/\s+/)
  return `${primeiro?.[0] ?? ''}${segundo?.[0] ?? ''}`.toUpperCase()
}

function primeiroNome(nome: string) {
  return nome.trim().split(/\s+/)[0] ?? ''
}

/**
 * Identidade pública do egresso — usada em qualquer tela autenticada (painel,
 * perfil, breadcrumb, modais). NÃO inclui matrículas/respostas; esses ficam em
 * transformers próprios (`MatriculaTransformer`, `RespostaTransformer`).
 */
export default class EgressoTransformer extends BaseTransformer<Egresso> {
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
}
