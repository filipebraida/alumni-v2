import type RespostaPessoa from '#models/resposta_pessoa'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { SETOR_LABELS } from '#enums/setor'

export default class RespostaPessoaTransformer extends BaseTransformer<RespostaPessoa> {
  toObject() {
    const r = this.resource
    return {
      ano: r.ano,
      registradaEm: r.registradaEm.toISO(),
      localizacao:
        [r.localizacaoCidade, r.localizacaoUf, r.localizacaoPais].filter(Boolean).join(' · ') ||
        null,
      empregador: r.empregador,
      cargo: r.cargo,
      setor: r.setor ? SETOR_LABELS[r.setor] : null,
    }
  }

  forRevisao() {
    return this.pick(this.resource, [
      'localizacaoCidade',
      'localizacaoUf',
      'localizacaoPais',
      'empregador',
      'cargo',
      'setor',
      'faixaSalarial',
    ])
  }
}
