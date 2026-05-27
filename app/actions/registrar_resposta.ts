import { DateTime } from 'luxon'

import Resposta from '#models/resposta'
import type { Setor } from '#enums/setor'
import type { FaixaSalarial } from '#enums/faixa_salarial'
import type { RelacaoFormacao } from '#enums/relacao_formacao'
import type { TempoPrimeiroEmprego } from '#enums/tempo_primeiro_emprego'
import type { NivelPos } from '#enums/nivel_academico'
import type { StatusPos } from '#enums/status_pos'

export interface RegistrarRespostaInput {
  egressoId: number
  /** Ano de referência; padrão = ano atual. */
  ano?: number
  localizacaoCidade?: string | null
  localizacaoUf?: string | null
  localizacaoPais?: string | null
  empregador?: string | null
  cargo?: string | null
  setor?: Setor | null
  faixaSalarial?: FaixaSalarial | null
  relacaoFormacao?: RelacaoFormacao | null
  tempoPrimeiroEmprego?: TempoPrimeiroEmprego | null
  posGrau?: NivelPos | null
  posCurso?: string | null
  posInstituicao?: string | null
  posStatus?: StatusPos | null
}

/**
 * Insere uma nova Resposta (append-only) com o estado informado dos 8 campos.
 * Cada chamada = uma linha nova no histórico; nunca sobrescreve. O caller monta
 * o conjunto completo (campos confirmados carregam o último valor conhecido).
 */
export default class RegistrarResposta {
  async handle({ ano, ...campos }: RegistrarRespostaInput): Promise<Resposta> {
    return Resposta.create({
      ...campos,
      ano: ano ?? DateTime.now().year,
      registradaEm: DateTime.now(),
    })
  }
}
