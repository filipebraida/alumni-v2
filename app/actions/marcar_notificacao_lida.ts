import { DateTime } from 'luxon'

import Notification from '#models/notification'

export interface MarcarNotificacaoLidaInput {
  userId: number
  notificacaoId: number
}

export type MarcarNotificacaoLidaResult = { status: 'marcada' } | { status: 'nao_encontrada' }

/**
 * Marca UMA notificacao do usuario como lida (e tambem vista, caso ainda nao
 * esteja). Idempotente: se a notificacao nao pertence ao usuario ou nao existe,
 * volta `nao_encontrada` sem efeitos colaterais.
 */
export default class MarcarNotificacaoLida {
  async handle({
    userId,
    notificacaoId,
  }: MarcarNotificacaoLidaInput): Promise<MarcarNotificacaoLidaResult> {
    const notificacao = await Notification.query()
      .where('notifiableId', String(userId))
      .where('id', notificacaoId)
      .first()

    if (!notificacao) return { status: 'nao_encontrada' as const }

    const agora = DateTime.now()
    notificacao.status = 'read'
    notificacao.readAt = agora
    if (!notificacao.seenAt) notificacao.seenAt = agora
    await notificacao.save()

    return { status: 'marcada' as const }
  }
}
