export const STATUS_POS = ['cursando', 'concluido', 'trancado'] as const

export type StatusPos = (typeof STATUS_POS)[number]
