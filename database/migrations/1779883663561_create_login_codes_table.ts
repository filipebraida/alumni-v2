import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'login_codes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('email', 254).notNullable()
      table.string('code_hash', 64).notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('used_at').nullable()
      table.integer('attempts').notNullable().defaultTo(0)
      table.string('ip_address', 45).nullable()
      table.string('user_agent', 512).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['email', 'used_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
