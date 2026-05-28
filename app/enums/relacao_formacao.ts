export const RELACOES_FORMACAO = ['total', 'parcial', 'diferente', 'nao_trabalha'] as const

export type RelacaoFormacao = (typeof RELACOES_FORMACAO)[number]

export const RELACAO_FORMACAO_LABELS: Record<RelacaoFormacao, string> = {
  total: 'Sim, totalmente relacionado',
  parcial: 'Sim, parcialmente',
  diferente: 'Não, em área diferente',
  nao_trabalha: 'Não trabalho atualmente',
}
