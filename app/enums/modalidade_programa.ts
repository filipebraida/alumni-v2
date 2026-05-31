export const MODALIDADES_PROGRAMA = ['academico', 'profissional'] as const

export type ModalidadePrograma = (typeof MODALIDADES_PROGRAMA)[number]

export const MODALIDADE_PROGRAMA_LABELS: Record<ModalidadePrograma, string> = {
  academico: 'Acadêmico',
  profissional: 'Profissional',
}
