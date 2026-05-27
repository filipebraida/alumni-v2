import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'respostas'

  // Append-only: cada confirmação/atualização insere uma nova linha.
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('egresso_id')
        .notNullable()
        .references('id')
        .inTable('egressos')
        .onDelete('CASCADE')
      table.integer('ano').notNullable() // ano de referência

      // 8 campos MEC (todos opcionais — campo pulado/não informado = null)
      table.string('localizacao_cidade').nullable()
      table.string('localizacao_uf', 2).nullable()
      table.string('localizacao_pais').nullable()
      table.string('empregador').nullable()
      table.string('cargo').nullable()
      table.string('setor').nullable()
      table.string('faixa_salarial').nullable()
      table.string('relacao_formacao').nullable()
      table.string('tempo_primeiro_emprego').nullable()
      table.string('pos_grau').nullable()
      table.string('pos_curso').nullable()
      table.string('pos_instituicao').nullable()
      table.string('pos_status').nullable()

      table.timestamp('registrada_em').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['egresso_id', 'registrada_em'])
      table.index(['egresso_id', 'ano'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
