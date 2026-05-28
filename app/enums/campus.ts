export const CAMPI = ['seropedica', 'nova_iguacu', 'tres_rios', 'campos'] as const

export type Campus = (typeof CAMPI)[number]

export const CAMPUS_LABELS: Record<Campus, string> = {
  seropedica: 'Seropédica',
  nova_iguacu: 'Nova Iguaçu',
  tres_rios: 'Três Rios',
  campos: 'Campos',
}
