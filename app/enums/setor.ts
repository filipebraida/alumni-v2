export const SETORES = [
  'privado',
  'publico_executivo',
  'pesquisa_publica',
  'academia',
  'ong',
  'autonomo',
  'nao_trabalha',
] as const

export type Setor = (typeof SETORES)[number]

export const SETOR_LABELS: Record<Setor, string> = {
  privado: 'Setor privado',
  publico_executivo: 'Setor público (executivo)',
  pesquisa_publica: 'Pesquisa pública',
  academia: 'Academia / ensino',
  ong: 'ONG / 3º setor',
  autonomo: 'Autônomo / empreendedor',
  nao_trabalha: 'Não trabalho atualmente',
}
