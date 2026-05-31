import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Dropa `respostas` (modelo antigo amontoado: dados gerais + graduação +
 * pós num único registro). Substituída pelo split D1 em `respostas_pessoa` +
 * `respostas_curso`. Sem backfill — pré-produção.
 */
export default class extends BaseSchema {
  protected tableName = 'respostas'

  async up() {
    this.schema.dropTable(this.tableName)
  }

  async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('egresso_id')
        .unsigned()
        .notNullable()
        .references('egressos.id')
        .onDelete('CASCADE')
      table.integer('ano').notNullable()
      table.timestamp('registrada_em').notNullable()

      table.string('localizacao_cidade', 120).nullable()
      table.string('localizacao_uf', 2).nullable()
      table.string('localizacao_pais', 80).nullable()
      table.string('empregador', 160).nullable()
      table.string('cargo', 160).nullable()
      table.string('setor', 30).nullable()
      table.string('faixa_salarial', 20).nullable()
      table.string('relacao_formacao', 20).nullable()
      table.string('tempo_primeiro_emprego', 20).nullable()
      table.string('pos_grau', 20).nullable()
      table.string('pos_curso', 160).nullable()
      table.string('pos_instituicao', 160).nullable()
      table.string('pos_status', 20).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.unique(['egresso_id', 'ano'])
    })
  }
}
