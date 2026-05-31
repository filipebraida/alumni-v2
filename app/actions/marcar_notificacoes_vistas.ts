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
    // `.update()` raw não passa por serialização de modelo — DateTime precisa
    // virar string SQL na mão (better-sqlite3 só aceita string/number/buffer/null)
    const agora = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')

    await Notification.query()
      .where('notifiableId', String(userId))
      .whereNull('seenAt')
      .update({ status: 'seen', seenAt: agora, updatedAt: agora })
  }
}
