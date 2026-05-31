import User from '#models/user'

export interface AtualizarPerfilInput {
  userId: number
  fullName: string
  // Identidade visível.
  nomeSocial: string | null
  headline: string | null
  bio: string | null
  // Contato.
  telefone: string | null
  cidade: string | null
  uf: string | null
  pais: string | null
  // Identificadores acadêmicos / redes.
  lattes: string | null
  orcid: string | null
  scholar: string | null
  linkedin: string | null
  github: string | null
  site: string | null
  // Privacidade.
  visEmail: boolean
  visMapa: boolean
  visEncontrar: boolean
}

export type AtualizarPerfilResult = { status: 'atualizado' } | { status: 'nao_encontrado' }

/**
 * Persiste o "Perfil" do usuário. Todos os campos vivem em `users` (perfil
 * é role-agnostic). `fotoUrl` está propositalmente fora: upload de imagem
 * é outro fluxo (storage + URL assinada).
 */
export default class AtualizarPerfil {
  async handle(input: AtualizarPerfilInput): Promise<AtualizarPerfilResult> {
    const user = await User.find(input.userId)
    if (!user) return { status: 'nao_encontrado' as const }

    user.merge({
      fullName: input.fullName.trim(),
      nomeSocial: blank(input.nomeSocial),
      headline: blank(input.headline),
      bio: blank(input.bio),
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
    await user.save()

    return { status: 'atualizado' as const }
  }
}

function blank(value: string | null | undefined): string | null {
  const v = (value ?? '').trim()
  return v === '' ? null : v
}
