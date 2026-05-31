import type Matricula from '#models/matricula'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { NIVEL_LABELS } from '#enums/nivel_academico'

/**
 * Resumo de uma matrícula (= "Formação" na view): nível, diploma, campus e
 * status. Espera `curso` e `curso.instituto` preloaded. NÃO carrega dados
 * agregados de turma/colegas/insight — esses vêm de queries próprias e podem
 * ser anexados pelo controller quando existirem.
 */
export default class MatriculaTransformer extends BaseTransformer<Matricula> {
  toObject() {
    const m = this.resource
    const concluida = m.situacao === 'formado'

    return {
      id: m.id,
      codigo: m.codigo,
      nivel: NIVEL_LABELS[m.curso.nivel],
      diploma: m.curso.nome,
      // Por enquanto `curto` espelha `diploma`. Quando o domínio ganhar um
      // nome curto (sem modalidade), trocar aqui sem mexer na view.
      curto: m.curso.nome,
      campus: m.curso.instituto?.nome ?? '—',
      rotuloTurma: concluida ? `Turma ${m.periodoFormatura ?? '—'}` : 'Em curso',
      periodo: m.periodoFormatura ?? '—',
      status: concluida ? ('concluido' as const) : ('em_curso' as const),
    }
  }
}
