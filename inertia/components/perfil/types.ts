/**
 * Estado do formulário de "Editar perfil" — role-agnostic. Tudo persiste em
 * `users` (a identidade visível é do usuário, não do papel). Foto continua
 * client-side enquanto upload real não existe.
 */
export type PerfilFormState = {
  fullName: string
  nomeSocial: string
  headline: string
  bio: string
  telefone: string
  cidade: string
  uf: string
  pais: string
  lattes: string
  orcid: string
  scholar: string
  linkedin: string
  github: string
  site: string
  visEmail: boolean
  visMapa: boolean
  visEncontrar: boolean
}

export type Vinculo = {
  id: number
  nivel: string
  curso: string
  instituto: string
  codigo: string
  periodoFormatura: string | null
  situacao: 'cursando' | 'formado' | 'evadido'
}

export type CursoCoordenado = {
  id: number
  nome: string
  codigo: string
  nivel: string
  instituto: string
}

/** Identidade visível, válida pra qualquer role. */
export type Perfil = {
  fullName: string
  iniciais: string
  emailLogin: string
  role: string
  roleLabel: string
  nomeSocial: string | null
  headline: string | null
  bio: string | null
  fotoUrl: string | null
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

/** Bloco extra quando o user também é egresso. */
export type PerfilEgresso = {
  cpf: string
  nomeAcademico: string
  emailPessoal: string | null
  vinculos: Vinculo[]
}

/** Bloco extra quando o user também é coordenador. */
export type PerfilGestor = {
  cargo: string | null
  cursos: CursoCoordenado[]
}

export function estadoInicialDoPerfil(perfil: Perfil): PerfilFormState {
  return {
    fullName: perfil.fullName,
    nomeSocial: perfil.nomeSocial ?? '',
    headline: perfil.headline ?? '',
    bio: perfil.bio ?? '',
    telefone: perfil.telefone ?? '',
    cidade: perfil.cidade ?? '',
    uf: perfil.uf ?? '',
    pais: perfil.pais ?? 'Brasil',
    lattes: perfil.lattes ?? '',
    orcid: perfil.orcid ?? '',
    scholar: perfil.scholar ?? '',
    linkedin: perfil.linkedin ?? '',
    github: perfil.github ?? '',
    site: perfil.site ?? '',
    visEmail: perfil.visEmail,
    visMapa: perfil.visMapa,
    visEncontrar: perfil.visEncontrar,
  }
}

/** Vai pro `router.put`. Strings vazias viram `null`; UF e ORCID em uppercase. */
export function payloadParaSalvar(form: PerfilFormState) {
  const nulled = (v: string) => (v.trim() === '' ? null : v.trim())
  return {
    fullName: form.fullName,
    nomeSocial: nulled(form.nomeSocial),
    headline: nulled(form.headline),
    bio: nulled(form.bio),
    telefone: nulled(form.telefone),
    cidade: nulled(form.cidade),
    uf: form.uf.trim() === '' ? null : form.uf.toUpperCase(),
    pais: nulled(form.pais),
    lattes: nulled(form.lattes),
    orcid: form.orcid.trim() === '' ? null : form.orcid.toUpperCase(),
    scholar: nulled(form.scholar),
    linkedin: nulled(form.linkedin),
    github: nulled(form.github),
    site: nulled(form.site),
    visEmail: form.visEmail,
    visMapa: form.visMapa,
    visEncontrar: form.visEncontrar,
  }
}
