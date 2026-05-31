import vine from '@vinejs/vine'
import { SETORES } from '#enums/setor'
import { FAIXAS_SALARIAIS } from '#enums/faixa_salarial'
import { RELACOES_FORMACAO } from '#enums/relacao_formacao'
import { TEMPOS_PRIMEIRO_EMPREGO } from '#enums/tempo_primeiro_emprego'

/**
 * Envelope de revisão do painel do egresso: 7 colunas de dados gerais
 * (compartilhadas, incluindo faixa salarial) + uma entrada por matrícula com
 * os 2 campos de graduação (relacao + tempo até 1º emprego). Pós-graduações
 * entram na lista só com `id` — esta entrega trata identidade apenas. O
 * action descarta IDs que não pertençam ao egresso autenticado.
 */
export const registrarRespostaValidator = vine.create(
  vine.object({
    localizacaoCidade: vine.string().trim().maxLength(120).nullable().optional(),
    localizacaoUf: vine.string().trim().fixedLength(2).nullable().optional(),
    localizacaoPais: vine.string().trim().maxLength(80).nullable().optional(),
    empregador: vine.string().trim().maxLength(160).nullable().optional(),
    cargo: vine.string().trim().maxLength(160).nullable().optional(),
    setor: vine.enum(SETORES).nullable().optional(),
    faixaSalarial: vine.enum(FAIXAS_SALARIAIS).nullable().optional(),

    matriculas: vine
      .array(
        vine.object({
          id: vine.number().withoutDecimals().positive(),
          relacaoFormacao: vine.enum(RELACOES_FORMACAO).nullable().optional(),
          tempoPrimeiroEmprego: vine.enum(TEMPOS_PRIMEIRO_EMPREGO).nullable().optional(),
        })
      )
      .distinct('id'),
  })
)
