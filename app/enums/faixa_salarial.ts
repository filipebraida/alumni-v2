export const FAIXAS_SALARIAIS = [
  'ate_3k',
  'de_3k_6k',
  'de_6k_9k',
  'de_9k_12k',
  'de_12k_18k',
  'de_18k_25k',
  'acima_25k',
  'nao_informar',
] as const

export type FaixaSalarial = (typeof FAIXAS_SALARIAIS)[number]
