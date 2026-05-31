import type RespostaPessoa from '#models/resposta_pessoa'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { SETOR_LABELS } from '#enums/setor'

/**
 * `RespostaPessoa` (foto dos dados gerais do egresso) com labels resolvidos
 * para exibição na gestão. Junta as 3 partes de localização num único rótulo
 * e formata `setor` com o mapa de `app/enums/setor`. Campos próprios de cada
 * formação (faixa salarial, relação com a formação, tempo até 1º emprego)
 * vivem em `RespostaCurso` e têm seu próprio transformer.
 */
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
}
