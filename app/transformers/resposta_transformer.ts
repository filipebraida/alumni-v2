import type Resposta from '#models/resposta'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { FAIXA_SALARIAL_LABELS } from '#enums/faixa_salarial'
import { SETOR_LABELS } from '#enums/setor'
import { RELACAO_FORMACAO_LABELS } from '#enums/relacao_formacao'
import { TEMPO_PRIMEIRO_EMPREGO_LABELS } from '#enums/tempo_primeiro_emprego'
import { NIVEL_LABELS } from '#enums/nivel_academico'
import { STATUS_POS_LABELS } from '#enums/status_pos'

/**
 * Resposta com labels resolvidos para exibição na gestão. Junta as 3 partes
 * de localização num único rótulo e formata as enums com os mapas dos
 * `app/enums/*`, mantendo o frontend livre desses mapas.
 */
export default class RespostaTransformer extends BaseTransformer<Resposta> {
  toObject() {
    const r = this.resource
    return {
      ano: r.ano,
      registradaEm: r.registradaEm.toISO(),
      localizacao: [r.localizacaoCidade, r.localizacaoUf, r.localizacaoPais]
        .filter(Boolean)
        .join(' · ') || null,
      empregador: r.empregador,
      cargo: r.cargo,
      setor: r.setor ? SETOR_LABELS[r.setor] : null,
      faixaSalarial: r.faixaSalarial ? FAIXA_SALARIAL_LABELS[r.faixaSalarial] : null,
      relacaoFormacao: r.relacaoFormacao ? RELACAO_FORMACAO_LABELS[r.relacaoFormacao] : null,
      tempoPrimeiroEmprego: r.tempoPrimeiroEmprego
        ? TEMPO_PRIMEIRO_EMPREGO_LABELS[r.tempoPrimeiroEmprego]
        : null,
      posGrau: r.posGrau ? NIVEL_LABELS[r.posGrau] : null,
      posCurso: r.posCurso,
      posInstituicao: r.posInstituicao,
      posStatus: r.posStatus ? STATUS_POS_LABELS[r.posStatus] : null,
    }
  }
}
