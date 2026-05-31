import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Adiciona `data_ingresso` em `matriculas`. Usado pela ordenação cronológica
 * do seletor de formações no painel (`coalesce(data_ingresso, created_at)`).
 * Nullable — quando a coordenação não informa, cai pro created_at.
 */
export default class extends BaseSchema {
  protected tableName = 'matriculas'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.date('data_ingresso').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('data_ingresso')
    })
  }
}
