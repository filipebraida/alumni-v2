import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * `respostas_pessoa` — foto dos dados pessoais/profissionais do egresso num
 * instante. Uma por egresso/ano (D1 da pesquisa). Append-only — nunca update,
 * cada revisão gera uma linha nova.
 */
export default class extends BaseSchema {
  protected tableName = 'respostas_pessoa'

  async up() {
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

      // 7 dados gerais (compartilhados por todas as formações do egresso).
      // Faixa salarial mora aqui — é da pessoa num instante, não do diploma.
      table.string('localizacao_cidade', 120).nullable()
      table.string('localizacao_uf', 2).nullable()
      table.string('localizacao_pais', 80).nullable()
      table.string('empregador', 160).nullable()
      table.string('cargo', 160).nullable()
      table.string('setor', 30).nullable()
      table.string('faixa_salarial', 20).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Append-only: o egresso pode ter N respostas por ano (cada revisão é
      // uma linha nova). Sem UNIQUE em (egresso_id, ano).
      table.index(['egresso_id', 'ano'], 'idx_resp_pessoa_egresso_ano')
      table.index(['egresso_id', 'registrada_em'], 'idx_resp_pessoa_egresso_data')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
