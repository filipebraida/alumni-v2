import { defineConfig } from '@adonisjs/transmit'

/**
 * Canal SSE para entregar notificacoes em tempo real ao frontend (sino do
 * header). Sem `pingInterval` (uma sessao = uma aba; Inertia reconecta) e sem
 * `transport`, ou seja, store de subscriptions em memoria — suficiente para
 * deploy mono-no.
 */
export default defineConfig({
  pingInterval: false,
  transport: null,
})
