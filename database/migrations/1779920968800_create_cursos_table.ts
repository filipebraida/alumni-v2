import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cursos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('codigo').notNullable().unique() // código SIGAA do curso — chave natural
      table.string('nome').notNullable()
      table.string('nivel').notNullable()
      table.string('campus').notNullable()
      table.boolean('ativo').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['campus', 'nivel'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
