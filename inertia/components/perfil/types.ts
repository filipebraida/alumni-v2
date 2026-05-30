/**
 * Estado do formulário "Editar perfil" do egresso. Todos os campos persistem
 * em `egressos` (menos `foto`, que continua client-side enquanto o upload
 * real não existe). Field names refletem o snake_case do schema convertido
 * pra camelCase pelo Lucid (`nomeSocial`, `visEmail`, etc.).
 */
export type PerfilFormState = {
  nomeCompleto: string
  nomeSocial: string
  headline: string
  bio: string
  emailPessoal: string
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

export type Perfil = {
  nomeCompleto: string
  iniciais: string
  cpf: string
  emailLogin: string
  emailPessoal: string | null
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

export function estadoInicialDoPerfil(perfil: Perfil): PerfilFormState {
  return {
    nomeCompleto: perfil.nomeCompleto,
    nomeSocial: perfil.nomeSocial ?? '',
    headline: perfil.headline ?? '',
    bio: perfil.bio ?? '',
    emailPessoal: perfil.emailPessoal ?? '',
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

/** Vai pro `router.put`. Strings vazias viram `null` no server; UF e ORCID em uppercase. */
export function payloadParaSalvar(form: PerfilFormState) {
  const nulled = (v: string) => (v.trim() === '' ? null : v.trim())
  return {
    nomeCompleto: form.nomeCompleto,
    nomeSocial: nulled(form.nomeSocial),
    headline: nulled(form.headline),
    bio: nulled(form.bio),
    emailPessoal: nulled(form.emailPessoal),
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
