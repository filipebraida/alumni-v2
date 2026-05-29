import db from '@adonisjs/lucid/services/db'

import User from '#models/user'
import Egresso from '#models/egresso'
import Matricula from '#models/matricula'
import type { SituacaoMatricula } from '#enums/situacao_matricula'

export interface CadastrarEgressoNoCursoInput {
  cursoId: number
  nomeCompleto: string
  email: string
  cpf: string
  matriculaCodigo: string
  situacao: SituacaoMatricula
  periodoFormatura?: string | null
}

export type CadastrarEgressoNoCursoResult =
  | { status: 'criado'; nome: string }
  | { status: 'ja_no_curso'; nome: string }

/**
 * Adiciona um egresso direto ao roster de um curso (sem campanha/convite): liga
 * User ↔ Egresso ↔ Matrícula numa transação. Idempotente — reusa o usuário pelo
 * e-mail e o egresso pelo usuário; a matrícula é chaveada pelo código.
 */
export default class CadastrarEgressoNoCurso {
  async handle(input: CadastrarEgressoNoCursoInput): Promise<CadastrarEgressoNoCursoResult> {
    const cpf = input.cpf.replace(/\D/g, '')

    return db.transaction(async (trx) => {
      const user = await User.updateOrCreate(
        { email: input.email },
        { email: input.email, fullName: input.nomeCompleto },
        { client: trx }
      )

      const egresso = await Egresso.updateOrCreate(
        { userId: user.id },
        { userId: user.id, cpf, nomeCompleto: input.nomeCompleto, emailPessoal: input.email },
        { client: trx }
      )

      const jaNoCurso = await Matricula.query({ client: trx })
        .where('codigo', input.matriculaCodigo)
        .first()

      await Matricula.updateOrCreate(
        { codigo: input.matriculaCodigo },
        {
          codigo: input.matriculaCodigo,
          cursoId: input.cursoId,
          egressoId: egresso.id,
          situacao: input.situacao,
          periodoFormatura: input.periodoFormatura ?? null,
        },
        { client: trx }
      )

      return {
        status: jaNoCurso ? 'ja_no_curso' : 'criado',
        nome: input.nomeCompleto,
      }
    })
  }
}
