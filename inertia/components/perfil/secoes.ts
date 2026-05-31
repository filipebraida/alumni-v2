import { Award, Briefcase, Camera, GraduationCap, Lock, type LucideIcon, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import { type Perfil, type PerfilFormState } from '~/components/perfil/types'

export type PerfilSecaoId = 'foto' | 'contato' | 'academico' | 'coordenacao' | 'ids' | 'privacidade'

export type PerfilSecao = {
  id: PerfilSecaoId
  icon: LucideIcon
  label: string
}

/** Ordem das seções no rail e na página — mesma sequência do design. */
export const SECOES: readonly PerfilSecao[] = [
  { id: 'foto', icon: Camera, label: 'Foto e identidade' },
  { id: 'contato', icon: Mail, label: 'Contato e local' },
  { id: 'academico', icon: GraduationCap, label: 'Vínculos acadêmicos' },
  { id: 'coordenacao', icon: Briefcase, label: 'Coordenação' },
  { id: 'ids', icon: Award, label: 'Identificadores' },
  { id: 'privacidade', icon: Lock, label: 'Privacidade' },
] as const

/** Campos "públicos" que entram no cálculo de completude. */
const CAMPOS_PUBLICOS = [
  'fotoUrl',
  'headline',
  'bio',
  'telefone',
  'cidade',
  'lattes',
  'orcid',
  'linkedin',
] as const

export const TOTAL_CAMPOS_PUBLICOS = CAMPOS_PUBLICOS.length

/** Aceita o Perfil (vindo do server) ou o FormState (edit em progresso). */
type Origem =
  | Pick<Perfil, (typeof CAMPOS_PUBLICOS)[number]>
  | (PerfilFormState & { fotoUrl?: string | null })

export function contarPreenchidos(origem: Origem, fotoOverride?: string | null): number {
  return CAMPOS_PUBLICOS.filter((k) => {
    const valor =
      k === 'fotoUrl' && fotoOverride !== undefined
        ? fotoOverride
        : (origem as Record<string, unknown>)[k]
    return typeof valor === 'string' && valor.trim() !== ''
  }).length
}

/** SECOES filtradas pelo que o user tem direito de ver. */
export function secoesParaPerfil({
  temEgresso,
  temGestor,
}: {
  temEgresso: boolean
  temGestor: boolean
}) {
  return SECOES.filter((s) => {
    if (s.id === 'academico') return temEgresso
    if (s.id === 'coordenacao') return temGestor
    // Privacidade é só pra egresso (toggles falam de "colegas de turma" etc.).
    if (s.id === 'privacidade') return temEgresso
    return true
  })
}

/** Scroll-spy: observa as âncoras passadas e devolve qual está mais visível. */
export function useSecaoAtiva(secoes: readonly PerfilSecao[] = SECOES): PerfilSecaoId {
  const [ativo, setAtivo] = useState<PerfilSecaoId>(secoes[0]?.id ?? 'foto')

  useEffect(() => {
    const elementos = secoes
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elementos.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visivel) setAtivo(visivel.target.id as PerfilSecaoId)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    elementos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // secoes é uma referência estável vinda de SECOES filtrado — não muda em runtime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ativo
}

export function irParaSecao(id: PerfilSecaoId) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
