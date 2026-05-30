import db from '@adonisjs/lucid/services/db'

import Egresso from '#models/egresso'
import Matricula from '#models/matricula'
import type { SituacaoMatricula } from '#enums/situacao_matricula'

export interface VincularEgressoAoCursoInput {
  cursoId: number
  egressoId: number
  matriculaCodigo: string
  situacao: SituacaoMatricula
  periodoFormatura?: string | null
}

export type VincularEgressoAoCursoResult =
  | { status: 'vinculado'; nome: string }
  | { status: 'egresso_inexistente' }
  | { status: 'ja_no_curso' }
  | { status: 'matricula_em_uso' }

/**
 * Vincula um egresso já existente a um curso, criando apenas a Matrícula. Nunca
 * mexe na identidade (nome/CPF/e-mail) do egresso — quem coordena o curso novo
 * só registra o vínculo acadêmico. Aborta se o egresso sumiu, se já tem
 * matrícula neste curso, ou se o código informado pertence a outra pessoa.
 */
export default class VincularEgressoAoCurso {
  async handle(input: VincularEgressoAoCursoInput): Promise<VincularEgressoAoCursoResult> {
    return db.transaction(async (trx) => {
      const egresso = await Egresso.find(input.egressoId, { client: trx })
      if (!egresso) return { status: 'egresso_inexistente' as const }

      const jaNoCurso = await Matricula.query({ client: trx })
        .where('egressoId', input.egressoId)
        .where('cursoId', input.cursoId)
        .first()
      if (jaNoCurso) return { status: 'ja_no_curso' as const }

      const matriculaEmUso = await Matricula.query({ client: trx })
        .where('codigo', input.matriculaCodigo)
        .first()
      if (matriculaEmUso) return { status: 'matricula_em_uso' as const }

      await Matricula.create(
        {
          codigo: input.matriculaCodigo,
          cursoId: input.cursoId,
          egressoId: egresso.id,
          situacao: input.situacao,
          periodoFormatura: input.periodoFormatura ?? null,
        },
        { client: trx }
      )

      return { status: 'vinculado' as const, nome: egresso.nomeCompleto }
    })
  }
}
