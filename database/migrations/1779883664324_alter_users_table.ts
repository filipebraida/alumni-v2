import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Login is now passwordless (email code), so the password column is dropped.
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('password')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password').notNullable()
    })
  }
}
