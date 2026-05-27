export const SITUACOES_MATRICULA = ['cursando', 'formado', 'evadido'] as const

export type SituacaoMatricula = (typeof SITUACOES_MATRICULA)[number]
