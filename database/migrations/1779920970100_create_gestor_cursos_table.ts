import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gestor_cursos'

  // Pivot N:M — quais cursos cada gestor gere.
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('gestor_id')
        .notNullable()
        .references('id')
        .inTable('gestores')
        .onDelete('CASCADE')
      table.integer('curso_id').notNullable().references('id').inTable('cursos').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['gestor_id', 'curso_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
