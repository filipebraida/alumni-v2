import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'egressos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('cpf', 14).notNullable().unique()
      table.string('nome_completo').notNullable()
      table.string('email_pessoal', 254).nullable()
      table.timestamp('consentimento_em').nullable()

      // Identidade visível (preenchida pelo próprio egresso no /perfil).
      table.string('nome_social', 80).nullable()
      table.string('headline', 160).nullable()
      table.text('bio').nullable()
      table.text('foto_url').nullable()

      // Contato e localização.
      table.string('telefone', 32).nullable()
      table.string('cidade', 80).nullable()
      table.string('uf', 2).nullable()
      table.string('pais', 80).nullable()

      // Identificadores acadêmicos e redes profissionais.
      table.string('lattes', 254).nullable()
      table.string('orcid', 19).nullable() // 0000-0000-0000-0000 (19 chars com hífens)
      table.string('scholar', 254).nullable()
      table.string('linkedin', 80).nullable()
      table.string('github', 80).nullable()
      table.string('site', 254).nullable()

      // Privacidade — defaults conforme o design (opt-in pra colegas).
      table.boolean('vis_email').notNullable().defaultTo(true)
      table.boolean('vis_mapa').notNullable().defaultTo(true)
      table.boolean('vis_encontrar').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
