export const NIVEIS_ACADEMICOS = [
  'graduacao',
  'especializacao',
  'mba',
  'mestrado',
  'doutorado',
  'posdoc',
] as const

export type NivelAcademico = (typeof NIVEIS_ACADEMICOS)[number]

/** Subconjunto de pós-graduação — usado no campo `pos_grau` das respostas. */
export const NIVEIS_POS = ['especializacao', 'mba', 'mestrado', 'doutorado', 'posdoc'] as const

export type NivelPos = (typeof NIVEIS_POS)[number]
