import { column } from '@adonisjs/lucid/orm'

import { NotificationSchema } from '#database/schema'

export type NotificationStatus = 'unseen' | 'seen' | 'read'

export interface NotificationContent {
  title?: string
  body?: string
  [key: string]: unknown
}

// O canal `database` do facteur grava via knex bruto: `content` e `tags` vao
// como JSON em colunas TEXT, datas em ISO. Os hooks de coluna a seguir fazem o
// caminho Lucid (leitura/escrita por aqui) ler/serializar do mesmo jeito.
// `content` e `tags` ficam fora do schema gerado (`skipColumns` em schema_rules)
// e sao declarados aqui com prepare/consume.
function parseJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return JSON.parse(value) as T
  return value as T
}

export default class Notification extends NotificationSchema {
  @column({
    prepare: (value: NotificationContent) => JSON.stringify(value),
    consume: (value: unknown) => parseJson<NotificationContent>(value) ?? {},
  })
  declare content: NotificationContent

  @column({
    prepare: (value: string[] | null) => (value === null ? null : JSON.stringify(value)),
    consume: (value: unknown) => parseJson<string[]>(value),
  })
  declare tags: string[] | null
}
