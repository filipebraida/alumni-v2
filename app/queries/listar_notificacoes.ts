import Notification from '#models/notification'

import ContarNotificacoesNaoVistas from '#queries/contar_notificacoes_nao_vistas'

import NotificationTransformer from '#transformers/notification_transformer'

const LIMITE_PADRAO = 20

export interface ListarNotificacoesInput {
  userId: number
  limite?: number
}

export interface ListarNotificacoesResult {
  itens: ReturnType<NotificationTransformer['toObject']>[]
  naoVistas: number
}

/**
 * Lista as notificacoes mais recentes da caixa pessoal do usuario (limit padrao
 * de 20) e o contador de nao-vistas para o badge do sino.
 */
export default class ListarNotificacoes {
  async handle({
    userId,
    limite = LIMITE_PADRAO,
  }: ListarNotificacoesInput): Promise<ListarNotificacoesResult> {
    const itens = await Notification.query()
      .where('notifiableId', String(userId))
      .orderBy('createdAt', 'desc')
      .limit(limite)

    const naoVistas = await new ContarNotificacoesNaoVistas().handle({ userId })

    return {
      itens: itens.map((item) => new NotificationTransformer(item).toObject()),
      naoVistas,
    }
  }
}
