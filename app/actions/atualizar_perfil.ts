import db from '@adonisjs/lucid/services/db'

import User from '#models/user'

export interface AtualizarPerfilInput {
  userId: number
  // Persistido em User + Egresso.
  nomeCompleto: string
  // Persistidos em Egresso.
  nomeSocial: string | null
  headline: string | null
  bio: string | null
  emailPessoal: string | null
  telefone: string | null
  cidade: string | null
  uf: string | null
  pais: string | null
  lattes: string | null
  orcid: string | null
  scholar: string | null
  linkedin: string | null
  github: string | null
  site: string | null
  visEmail: boolean
  visMapa: boolean
  visEncontrar: boolean
}

export type AtualizarPerfilResult = { status: 'atualizado' } | { status: 'sem_egresso' }

/**
 * Persiste o "Perfil" do egresso. Nome completo vai em `users.full_name` (pra
 * saudação no app) e `egressos.nome_completo` (fonte canônica acadêmica) —
 * mantidos em sincronia via transação. Demais campos só em `egressos`.
 *
 * `fotoUrl` está propositalmente fora: upload de imagem ainda não tem fluxo
 * (storage + URL); a UI mantém preview client-side até lá.
 */
export default class AtualizarPerfil {
  async handle(input: AtualizarPerfilInput): Promise<AtualizarPerfilResult> {
    return db.transaction(async (trx) => {
      const user = await User.query({ client: trx })
        .where('id', input.userId)
        .preload('egresso')
        .first()

      if (!user || !user.egresso) return { status: 'sem_egresso' as const }

      const nome = input.nomeCompleto.trim()

      user.useTransaction(trx)
      user.fullName = nome
      await user.save()

      user.egresso.useTransaction(trx)
      user.egresso.merge({
        nomeCompleto: nome,
        nomeSocial: blank(input.nomeSocial),
        headline: blank(input.headline),
        bio: blank(input.bio),
        emailPessoal: blank(input.emailPessoal),
        telefone: blank(input.telefone),
        cidade: blank(input.cidade),
        uf: input.uf ? input.uf.toUpperCase() : null,
        pais: blank(input.pais),
        lattes: blank(input.lattes),
        orcid: input.orcid ? input.orcid.toUpperCase() : null,
        scholar: blank(input.scholar),
        linkedin: blank(input.linkedin),
        github: blank(input.github),
        site: blank(input.site),
        visEmail: input.visEmail,
        visMapa: input.visMapa,
        visEncontrar: input.visEncontrar,
      })
      await user.egresso.save()

      return { status: 'atualizado' as const }
    })
  }
}

/** Strings vazias viram NULL — o validador transforma `''` em `''` (trim), não em null. */
function blank(value: string | null | undefined): string | null {
  const v = (value ?? '').trim()
  return v === '' ? null : v
}
