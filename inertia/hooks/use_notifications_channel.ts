import { useEffect } from 'react'

import { getTransmitSingleton } from '~/hooks/use_transmit'

/**
 * Inscreve o usuario logado no canal SSE pessoal de notificacoes
 * (`notifications/user-<id>`) e dispara `onMessage` em cada evento recebido.
 *
 * A conexao SSE em si vive no singleton do `useTransmit` (uma EventSource por
 * aba); este hook so cuida do ciclo de vida da inscricao.
 */
export function useNotificationsChannel(userId: number | undefined, onMessage: () => void) {
  useEffect(() => {
    if (!userId) return

    const transmit = getTransmitSingleton()
    const subscription = transmit.subscription(`notifications/user-${userId}`)

    subscription.onMessage(() => onMessage())
    void subscription.create()

    return () => {
      void subscription.delete()
    }
  }, [userId, onMessage])
}
