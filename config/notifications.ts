import { channels, defineConfig } from '@facteurjs/adonisjs'
import type { InferChannels } from '@facteurjs/adonisjs/types'

/**
 * Configuracao do facteur (sistema de notificacoes). Dois canais ativos:
 * - `database`: persiste cada notificacao na tabela `notifications` via knex,
 *   alimentando o sino do header (lista + contador de nao-vistas).
 * - `transmit`: empurra um evento SSE no canal pessoal do usuario para o sino
 *   abrir/recarregar a lista em tempo real.
 *
 * Leituras e marcacoes (read/seen) sao feitas pelo `NotificacoesController` via
 * Lucid (`#models/notification`), entao nao precisamos do `databaseAdapter`
 * (que sao as APIs do package).
 */
const notificationsConfig = defineConfig({
  channels: {
    database: channels.database({}),
    transmit: channels.transmit(),
  },
})

export default notificationsConfig

declare module '@facteurjs/adonisjs/types' {
  interface NotificationChannels extends InferChannels<typeof notificationsConfig> {}
}
