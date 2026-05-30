import { DateTime } from 'luxon'

import Notification from '#models/notification'

export interface MarcarNotificacoesVistasInput {
  userId: number
}

/**
 * Marca como "vistas" todas as notificacoes nao-vistas do usuario. Disparado
 * quando o popover do sino abre — zera o badge sem afetar a lista (`unseen` ->
 * `seen`; `read` continua `read`).
 */
export default class MarcarNotificacoesVistas {
  async handle({ userId }: MarcarNotificacoesVistasInput): Promise<void> {
    const agora = DateTime.now()

    await Notification.query()
      .where('notifiableId', String(userId))
      .whereNull('seenAt')
      .update({ status: 'seen', seenAt: agora, updatedAt: agora })
  }
}
