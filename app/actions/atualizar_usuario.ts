import db from '@adonisjs/lucid/services/db'

import User from '#models/user'
import Gestor from '#models/gestor'
import type { RoleUsuario } from '#enums/role_usuario'

export interface AtualizarUsuarioInput {
  id: number
  fullName: string
  role: RoleUsuario
  cursosIds: number[]
}

export type AtualizarUsuarioResult =
  | { status: 'atualizado'; usuario: { id: number; nome: string } }
  | { status: 'nao_encontrado' }
  | { status: 'sem_acesso' }

/**
 * Edita o usuário e ajusta o vínculo de coordenação. Se algum curso é passado
 * e ainda não existe `Gestor`, cria-o on-demand; se a lista vier vazia, apenas
 * desfaz o pivot (o `Gestor` em si fica — preserva o registro histórico).
 *
 * Bloqueia configurações que deixariam o usuário órfão (não-admin sem curso
 * coordenado e sem perfil de egresso — sem área para entrar).
 */
export default class AtualizarUsuario {
  async handle({
    id,
    fullName,
    role,
    cursosIds,
  }: AtualizarUsuarioInput): Promise<AtualizarUsuarioResult> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx })
        .where('id', id)
        .preload('egresso')
        .first()
      if (!user) return { status: 'nao_encontrado' as const }

      if (role !== 'admin' && cursosIds.length === 0 && !user.egresso) {
        return { status: 'sem_acesso' as const }
      }

      user.useTransaction(trx)
      user.fullName = fullName.trim()
      user.role = role
      await user.save()

      let gestor = await Gestor.query({ client: trx }).where('user_id', user.id).first()
      if (!gestor && cursosIds.length > 0) {
        gestor = await Gestor.create(
          { userId: user.id, nomeCompleto: user.fullName ?? user.email, cargo: 'Coordenador' },
          { client: trx }
        )
      }
      if (gestor) {
        await gestor.related('cursos').sync(cursosIds)
      }

      return {
        status: 'atualizado' as const,
        usuario: { id: user.id, nome: user.fullName ?? user.email },
      }
    })
  }
}
