export const ROLES_USUARIO = ['usuario', 'admin'] as const

export type RoleUsuario = (typeof ROLES_USUARIO)[number]
