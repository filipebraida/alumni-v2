export const TEMPOS_PRIMEIRO_EMPREGO = [
  'antes_de_formar',
  'ate_3m',
  'de_3_6m',
  'de_6m_1a',
  'mais_1a',
  'ainda_procura',
] as const

export type TempoPrimeiroEmprego = (typeof TEMPOS_PRIMEIRO_EMPREGO)[number]

export const TEMPO_PRIMEIRO_EMPREGO_LABELS: Record<TempoPrimeiroEmprego, string> = {
  antes_de_formar: 'Já trabalhava antes de formar',
  ate_3m: 'Menos de 3 meses',
  de_3_6m: '3 a 6 meses',
  de_6m_1a: '6 meses a 1 ano',
  mais_1a: 'Mais de 1 ano',
  ainda_procura: 'Ainda procuro emprego',
}
