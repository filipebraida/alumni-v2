import { DateTime } from 'luxon'

import Notification from '#models/notification'

export interface MarcarNotificacoesLidasInput {
  userId: number
}

/**
 * Marca como "lidas" todas as notificacoes do usuario que ainda nao estao
 * lidas. Acionado pelo botao "marcar todas como lidas" no popover do sino.
 */
export default class MarcarNotificacoesLidas {
  async handle({ userId }: MarcarNotificacoesLidasInput): Promise<void> {
    const agora = DateTime.now()

    await Notification.query()
      .where('notifiableId', String(userId))
      .whereNot('status', 'read')
      .update({ status: 'read', readAt: agora, seenAt: agora, updatedAt: agora })
  }
}
