import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('egresso_id')
        .notNullable()
        .references('id')
        .inTable('egressos')
        .onDelete('CASCADE')
      table.string('codigo').notNullable().unique() // matrícula SIGAA — âncora imutável
      table.string('curso').notNullable()
      table.string('nivel').notNullable()
      table.string('campus').notNullable()
      table.string('periodo_formatura').nullable() // ex.: "2022.2"
      table.date('data_colacao').nullable()
      table.string('situacao').notNullable().defaultTo('formado')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['egresso_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
