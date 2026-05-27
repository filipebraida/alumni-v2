export const CAMPI = ['seropedica', 'nova_iguacu', 'tres_rios', 'campos'] as const

export type Campus = (typeof CAMPI)[number]
