import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  // Caixa pessoal de notificacoes do usuario. Persistida pelo canal `database`
  // do facteur (knexAdapter) e lida pelo `NotificacoesController` via Lucid.
  // `notifiable_id` e `tenant_id` sao TEXT porque o knexAdapter aceita
  // `string | number` — manter alinhado com o que o adapter grava.
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.text('notifiable_id').notNullable()
      table.text('tenant_id').nullable()
      table.text('type').notNullable()
      table.text('content').notNullable()
      table.text('status').notNullable().defaultTo('unseen')
      table.text('tags').nullable()
      table.timestamp('read_at').nullable()
      table.timestamp('seen_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['notifiable_id'])
      table.index(['tenant_id'])
      table.index(['status'])
      table.index(['notifiable_id', 'tenant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
