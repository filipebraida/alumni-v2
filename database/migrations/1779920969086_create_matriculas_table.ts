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
      table
        .integer('curso_id')
        .notNullable()
        .references('id')
        .inTable('cursos')
        .onDelete('RESTRICT') // não apaga vínculos de aluno ao remover um curso
      table.string('codigo').notNullable().unique() // matrícula SIGAA — âncora imutável
      table.string('periodo_formatura').nullable() // ex.: "2022.2"
      table.date('data_colacao').nullable()
      // Ordenação cronológica do seletor de formações no painel
      // (`coalesce(data_ingresso, created_at)`). Nullable — quando a
      // coordenação não informa, cai pro created_at.
      table.date('data_ingresso').nullable()
      table.string('situacao').notNullable().defaultTo('formado')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['egresso_id'])
      table.index(['curso_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
