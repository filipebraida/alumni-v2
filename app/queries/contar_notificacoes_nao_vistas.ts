import Notification from '#models/notification'

export interface ContarNotificacoesNaoVistasInput {
  userId: number
}

/**
 * Conta quantas notificacoes do usuario ainda nao foram "vistas" (popover do
 * sino ainda nao foi aberto desde que chegaram). Alimenta o badge do sino e a
 * shared prop `unseenNotificationsCount` do Inertia.
 */
export default class ContarNotificacoesNaoVistas {
  async handle({ userId }: ContarNotificacoesNaoVistasInput): Promise<number> {
    const linha = await Notification.query()
      .where('notifiableId', String(userId))
      .whereNull('seenAt')
      .count('* as total')
      .first()

    return Number(linha?.$extras.total ?? 0)
  }
}
