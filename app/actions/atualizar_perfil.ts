import db from '@adonisjs/lucid/services/db'

import User from '#models/user'

export interface AtualizarPerfilInput {
  userId: number
  nomeCompleto: string
  emailPessoal: string | null
}

export type AtualizarPerfilResult = { status: 'atualizado' } | { status: 'sem_egresso' }

/**
 * Atualiza nome completo do egresso (em duas tabelas: `users.full_name` para a
 * saudação no app e `egressos.nome_completo` como a fonte canônica acadêmica)
 * e o e-mail pessoal. Tudo em uma transação para manter os dois nomes
 * sincronizados.
 */
export default class AtualizarPerfil {
  async handle({
    userId,
    nomeCompleto,
    emailPessoal,
  }: AtualizarPerfilInput): Promise<AtualizarPerfilResult> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).where('id', userId).preload('egresso').first()

      if (!user || !user.egresso) return { status: 'sem_egresso' as const }

      const nome = nomeCompleto.trim()

      user.useTransaction(trx)
      user.fullName = nome
      await user.save()

      user.egresso.useTransaction(trx)
      user.egresso.nomeCompleto = nome
      user.egresso.emailPessoal = emailPessoal?.trim() || null
      await user.egresso.save()

      return { status: 'atualizado' as const }
    })
  }
}
