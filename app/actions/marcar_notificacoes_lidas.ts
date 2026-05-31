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
    // `.update()` raw não passa por serialização de modelo — DateTime precisa
    // virar string SQL na mão (better-sqlite3 só aceita string/number/buffer/null)
    const agora = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')

    await Notification.query()
      .where('notifiableId', String(userId))
      .whereNot('status', 'read')
      .update({ status: 'read', readAt: agora, seenAt: agora, updatedAt: agora })
  }
}
