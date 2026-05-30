import { useEffect } from 'react'

import { getTransmitSingleton } from '~/hooks/use_transmit'

/**
 * Inscreve o usuario logado no canal SSE pessoal de notificacoes
 * (`notifications/user-<id>`) e dispara `onMessage` em cada evento recebido.
 *
 * A conexao SSE em si vive no singleton do `useTransmit` (uma EventSource por
 * aba); este hook so cuida do ciclo de vida da inscricao. Como o singleton
 * importa o transmit-client dinamicamente, o ciclo de subscribe e async: se a
 * tela desmontar antes do `import()` resolver, cancelamos sem assinar.
 */
export function useNotificationsChannel(userId: number | undefined, onMessage: () => void) {
  useEffect(() => {
    if (!userId) return

    let cancelled = false
    let subscription: { delete?: () => void } | null = null

    void (async () => {
      const transmit = await getTransmitSingleton()
      if (cancelled) return

      const sub = transmit.subscription(`notifications/user-${userId}`)
      sub.onMessage(() => onMessage())
      void sub.create()
      subscription = sub
    })()

    return () => {
      cancelled = true
      subscription?.delete?.()
    }
  }, [userId, onMessage])
}
