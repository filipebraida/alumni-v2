/**
 * Estado do formulário "Editar perfil" do egresso. Os primeiros 2 campos são
 * persistidos (User.fullName + Egresso.emailPessoal); o restante vive só na UI
 * por enquanto — colunas no schema vêm depois.
 */
export type PerfilFormState = {
  // Persistidos hoje:
  nomeCompleto: string
  emailPessoal: string
  // Client-only (preview do design):
  social: string
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

export type Perfil = {
  nomeCompleto: string
  iniciais: string
  cpf: string
  emailLogin: string
  emailPessoal: string | null
}

export function estadoInicialDoPerfil(perfil: Perfil): PerfilFormState {
  return {
    nomeCompleto: perfil.nomeCompleto,
    emailPessoal: perfil.emailPessoal ?? '',
    social: '',
    headline: '',
    bio: '',
    telefone: '',
    cidade: '',
    uf: '',
    pais: 'Brasil',
    lattes: '',
    orcid: '',
    scholar: '',
    linkedin: '',
    github: '',
    site: '',
    visEmail: true,
    visMapa: true,
    visEncontrar: true,
  }
}
