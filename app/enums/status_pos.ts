export const STATUS_POS = ['cursando', 'concluido', 'trancado'] as const

export type StatusPos = (typeof STATUS_POS)[number]

export const STATUS_POS_LABELS: Record<StatusPos, string> = {
  cursando: 'Cursando',
  concluido: 'Concluído',
  trancado: 'Trancado',
}
