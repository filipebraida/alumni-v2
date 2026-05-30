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
  | { status: 'cpf_em_uso' }
  | { status: 'email_em_uso' }
  | { status: 'matricula_em_uso' }

/**
 * Cria uma pessoa nova no roster do curso: User + Egresso + Matrícula em uma
 * transação. Pressuposto: o chamador (controller) já fez o lookup por CPF e
 * sabe que o egresso não existe. Se algum identificador único colidir (CPF,
 * e-mail ou código de matrícula), aborta a transação com status de conflito —
 * nunca sobrescreve identidade alheia.
 */
export default class CadastrarEgressoNoCurso {
  async handle(input: CadastrarEgressoNoCursoInput): Promise<CadastrarEgressoNoCursoResult> {
    const cpf = input.cpf.replace(/\D/g, '')
    const email = input.email.trim().toLowerCase()

    return db.transaction(async (trx) => {
      const cpfEmUso = await Egresso.query({ client: trx }).where('cpf', cpf).first()
      if (cpfEmUso) return { status: 'cpf_em_uso' as const }

      const emailEmUso = await User.query({ client: trx }).where('email', email).first()
      if (emailEmUso) return { status: 'email_em_uso' as const }

      const matriculaEmUso = await Matricula.query({ client: trx })
        .where('codigo', input.matriculaCodigo)
        .first()
      if (matriculaEmUso) return { status: 'matricula_em_uso' as const }

      const user = await User.create({ email, fullName: input.nomeCompleto }, { client: trx })
      const egresso = await Egresso.create(
        { userId: user.id, cpf, nomeCompleto: input.nomeCompleto, emailPessoal: email },
        { client: trx }
      )
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

      return { status: 'criado' as const, nome: input.nomeCompleto }
    })
  }
}
