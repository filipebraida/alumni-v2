import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import { NotificationSchema } from '#database/schema'

export type NotificationStatus = 'unseen' | 'seen' | 'read'

export interface NotificationContent {
  title?: string
  body?: string
  [key: string]: unknown
}

// O canal `database` do facteur grava via knex bruto: `content` e `tags` vao
// como JSON em colunas TEXT, e as datas como `Date` JS — que better-sqlite3
// armazena como NUMBER (epoch ms). O `@column.dateTime` padrao do Lucid nao
// consome numero, entao re-declaramos as datas com um consume tolerante.
// `content`/`tags` ficam fora do schema gerado (`skipColumns` em schema_rules).
function parseJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return JSON.parse(value) as T
  return value as T
}

function consumeDateTime(value: unknown): DateTime | null {
  if (value === null || value === undefined) return null
  if (value instanceof DateTime) return value
  if (value instanceof Date) return DateTime.fromJSDate(value)
  if (typeof value === 'number') return DateTime.fromMillis(value)
  if (typeof value === 'string') {
    const iso = DateTime.fromISO(value)
    if (iso.isValid) return iso
    const sql = DateTime.fromSQL(value)
    if (sql.isValid) return sql
  }
  return null
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

  @column.dateTime({ autoCreate: true, consume: consumeDateTime })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, consume: consumeDateTime })
  declare updatedAt: DateTime | null

  @column.dateTime({ consume: consumeDateTime })
  declare readAt: DateTime | null

  @column.dateTime({ consume: consumeDateTime })
  declare seenAt: DateTime | null
}
