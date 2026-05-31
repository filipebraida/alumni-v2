import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'programas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('codigo', 32).notNullable().unique() // PPGIHD, etc.
      table.string('nome').notNullable()
      table.string('sigla', 32).nullable()
      table.string('modalidade').nullable() // 'academico' | 'profissional' — só stricto sensu
      table
        .integer('instituto_id')
        .notNullable()
        .references('id')
        .inTable('institutos')
        .onDelete('RESTRICT')
      table.boolean('ativo').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['instituto_id', 'ativo'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
