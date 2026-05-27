import vine from '@vinejs/vine'
import { SETORES } from '#enums/setor'
import { FAIXAS_SALARIAIS } from '#enums/faixa_salarial'
import { RELACOES_FORMACAO } from '#enums/relacao_formacao'
import { TEMPOS_PRIMEIRO_EMPREGO } from '#enums/tempo_primeiro_emprego'
import { NIVEIS_POS } from '#enums/nivel_academico'
import { STATUS_POS } from '#enums/status_pos'

/** Valida os 8 campos MEC enviados ao registrar uma resposta. */
export const registrarRespostaValidator = vine.create({
  localizacaoCidade: vine.string().trim().maxLength(120).nullable().optional(),
  localizacaoUf: vine.string().trim().minLength(2).maxLength(2).nullable().optional(),
  localizacaoPais: vine.string().trim().maxLength(80).nullable().optional(),
  empregador: vine.string().trim().maxLength(160).nullable().optional(),
  cargo: vine.string().trim().maxLength(160).nullable().optional(),
  setor: vine.enum(SETORES).nullable().optional(),
  faixaSalarial: vine.enum(FAIXAS_SALARIAIS).nullable().optional(),
  relacaoFormacao: vine.enum(RELACOES_FORMACAO).nullable().optional(),
  tempoPrimeiroEmprego: vine.enum(TEMPOS_PRIMEIRO_EMPREGO).nullable().optional(),
  posGrau: vine.enum(NIVEIS_POS).nullable().optional(),
  posCurso: vine.string().trim().maxLength(160).nullable().optional(),
  posInstituicao: vine.string().trim().maxLength(160).nullable().optional(),
  posStatus: vine.enum(STATUS_POS).nullable().optional(),
})
