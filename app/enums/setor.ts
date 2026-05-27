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
