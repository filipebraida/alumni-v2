import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * `respostas_curso` — campos por matrícula/ano dentro de uma foto consolidada.
 * Filha de `respostas_pessoa`; uma linha por matrícula não-evadida do egresso
 * no instante da revisão. Colunas de graduação só são preenchidas quando
 * `matricula.curso.nivel = 'graduacao'`; pós nasce identidade-só (2 colunas
 * `null`) nesta entrega.
 *
 * `matricula_id` é RESTRICT — não permite apagar matrícula com histórico de
 * resposta. `resposta_pessoa_id` é CASCADE — a foto consolidada some inteira.
 */
export default class extends BaseSchema {
  protected tableName = 'respostas_curso'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('resposta_pessoa_id')
        .unsigned()
        .notNullable()
        .references('respostas_pessoa.id')
        .onDelete('CASCADE')
      table
        .integer('matricula_id')
        .unsigned()
        .notNullable()
        .references('matriculas.id')
        .onDelete('RESTRICT')
      table.integer('ano').notNullable()

      // Graduação — preenchidos só quando matricula.curso.nivel = 'graduacao'.
      // Faixa salarial vive em respostas_pessoa (é da pessoa, não do diploma).
      table.string('relacao_formacao', 20).nullable()
      table.string('tempo_primeiro_emprego', 20).nullable()

      // pós-graduação: identidade-só nesta entrega; campos D2 (satisfação, NPS,
      // ascensão_motivada_formacao, docente_permanente_snpg, continuidade)
      // entram em changes próprias.

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      // Append-only: N respostas_curso por matrícula/ano. Sem UNIQUE.
      table.index(['matricula_id', 'ano'], 'idx_resp_curso_matricula_ano')
      table.index('resposta_pessoa_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
