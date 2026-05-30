import { Award, Camera, GraduationCap, Lock, type LucideIcon, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import { type Perfil, type PerfilFormState } from '~/components/perfil/types'

export type PerfilSecaoId = 'foto' | 'contato' | 'academico' | 'ids' | 'privacidade'

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

/** Scroll-spy: observa as âncoras das seções e devolve qual está mais visível. */
export function useSecaoAtiva(): PerfilSecaoId {
  const [ativo, setAtivo] = useState<PerfilSecaoId>(SECOES[0].id)

  useEffect(() => {
    const elementos = SECOES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
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
  }, [])

  return ativo
}

export function irParaSecao(id: PerfilSecaoId) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
