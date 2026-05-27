export const TEMPOS_PRIMEIRO_EMPREGO = [
  'antes_de_formar',
  'ate_3m',
  'de_3_6m',
  'de_6m_1a',
  'mais_1a',
  'ainda_procura',
] as const

export type TempoPrimeiroEmprego = (typeof TEMPOS_PRIMEIRO_EMPREGO)[number]
