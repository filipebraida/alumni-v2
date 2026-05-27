export const RELACOES_FORMACAO = ['total', 'parcial', 'diferente', 'nao_trabalha'] as const

export type RelacaoFormacao = (typeof RELACOES_FORMACAO)[number]
