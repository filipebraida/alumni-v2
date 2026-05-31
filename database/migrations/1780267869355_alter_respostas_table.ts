import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Move `faixa_salarial` de `respostas_curso` pra `respostas_pessoa`. A faixa é
 * uma propriedade da pessoa num instante (uma pessoa, um salário), não da
 * matrícula. Mantê-la em respostas_curso causaria duplicação quando o egresso
 * tem mais de uma matrícula concluída.
 *
 * `relacao_formacao` e `tempo_primeiro_emprego` continuam em respostas_curso —
 * variam por diploma (aplicável só pra graduação).
 */
export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('respostas_pessoa', (table) => {
      table.string('faixa_salarial', 20).nullable()
    })
    this.schema.alterTable('respostas_curso', (table) => {
      table.dropColumn('faixa_salarial')
    })
  }

  async down() {
    this.schema.alterTable('respostas_curso', (table) => {
      table.string('faixa_salarial', 20).nullable()
    })
    this.schema.alterTable('respostas_pessoa', (table) => {
      table.dropColumn('faixa_salarial')
    })
  }
}
