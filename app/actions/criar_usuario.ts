import db from '@adonisjs/lucid/services/db'

import User from '#models/user'
import Gestor from '#models/gestor'
import type { RoleUsuario } from '#enums/role_usuario'

export interface CriarUsuarioInput {
  email: string
  fullName: string
  role: RoleUsuario
  cursosIds: number[]
}

export type CriarUsuarioResult =
  | { status: 'criado'; usuario: { id: number; nome: string } }
  | { status: 'email_em_uso' }
  | { status: 'sem_acesso' }

export default class CriarUsuario {
  async handle({
    email,
    fullName,
    role,
    cursosIds,
  }: CriarUsuarioInput): Promise<CriarUsuarioResult> {
    // No create não há perfil de egresso: o user só consegue entrar se for
    // admin ou se coordenar pelo menos um curso. Bloqueia órfãos.
    if (role !== 'admin' && cursosIds.length === 0) {
      return { status: 'sem_acesso' as const }
    }

    const emailNorm = email.trim().toLowerCase()

    return db.transaction(async (trx) => {
      const emUso = await User.query({ client: trx }).where('email', emailNorm).first()
      if (emUso) return { status: 'email_em_uso' as const }

      const user = await User.create(
        { email: emailNorm, fullName: fullName.trim(), role },
        { client: trx }
      )

      if (cursosIds.length > 0) {
        const gestor = await Gestor.create(
          { userId: user.id, nomeCompleto: user.fullName ?? user.email, cargo: 'Coordenador' },
          { client: trx }
        )
        await gestor.related('cursos').sync(cursosIds)
      }

      return {
        status: 'criado' as const,
        usuario: { id: user.id, nome: user.fullName ?? user.email },
      }
    })
  }
}
