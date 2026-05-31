import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      // Login é passwordless (código por e-mail) — sem coluna de senha.

      // Papel do usuário: `admin` libera o super-acesso; `usuario` é o default.
      table.string('role', 16).notNullable().defaultTo('usuario')

      // Identidade visível do perfil — vale pra qualquer role (egresso,
      // coordenador, admin). O "nome do diploma" continua em `egressos`/
      // `gestores` quando faz sentido; aqui é o perfil que o próprio user
      // edita: foto, headline, bio, contato, identificadores, privacidade.
      table.string('nome_social', 80).nullable()
      table.string('headline', 160).nullable()
      table.text('bio').nullable()
      table.text('foto_url').nullable()

      table.string('telefone', 32).nullable()
      table.string('cidade', 80).nullable()
      table.string('uf', 2).nullable()
      table.string('pais', 80).nullable()

      table.string('lattes', 254).nullable()
      table.string('orcid', 19).nullable()
      table.string('scholar', 254).nullable()
      table.string('linkedin', 80).nullable()
      table.string('github', 80).nullable()
      table.string('site', 254).nullable()

      table.boolean('vis_email').notNullable().defaultTo(true)
      table.boolean('vis_mapa').notNullable().defaultTo(true)
      table.boolean('vis_encontrar').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
