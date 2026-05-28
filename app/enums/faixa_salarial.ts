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

export const FAIXA_SALARIAL_LABELS: Record<FaixaSalarial, string> = {
  ate_3k: 'Até R$ 3.000',
  de_3k_6k: 'R$ 3.000 — R$ 6.000',
  de_6k_9k: 'R$ 6.000 — R$ 9.000',
  de_9k_12k: 'R$ 9.000 — R$ 12.000',
  de_12k_18k: 'R$ 12.000 — R$ 18.000',
  de_18k_25k: 'R$ 18.000 — R$ 25.000',
  acima_25k: 'Acima de R$ 25.000',
  nao_informar: 'Prefiro não informar',
}
