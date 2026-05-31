import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  GraduationCap,
  Globe,
  Link as LinkIcon,
} from 'lucide-react'
import { type ReactNode } from 'react'

import { cn } from '~/lib/utils'
import { Separator } from '~/components/ui/separator'
import { GlifoIcone, GlifoTexto } from '~/components/perfil/glifo'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/use_perfil_form'

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
}

function formatarOrcid(raw: string): string {
  const c = raw
    .replace(/[^0-9Xx]/g, '')
    .toUpperCase()
    .slice(0, 16)
  return c.replace(/(.{4})/g, '$1-').replace(/-$/, '')
}

/**
 * Identificadores acadêmicos e redes profissionais (ORCID, Lattes, Scholar,
 * LinkedIn, GitHub, site). Glifos monocromáticos por serviço — sem logos de
 * marca, pra manter consistência visual.
 */
export function PerfilIds({ form, set }: Props) {
  const orcidValid = form.orcid.replace(/[^0-9X]/gi, '').length === 16
  // Lattes ID é uma sequência de 16 dígitos. Aceita qualquer formato (URL,
  // só o número, com/sem prefixo) desde que tenha 16 dígitos seguidos.
  const lattesValid = /\d{16}/.test(form.lattes)
  const scholarValid = !!form.scholar.trim()
  const linkedinValid = !!form.linkedin.trim()
  const githubValid = !!form.github.trim()
  const siteValid = !!form.site.trim()

  return (
    <PerfilSectionCard
      id="ids"
      icon={Award}
      title="Identificadores acadêmicos"
      description="Conecte seus perfis de pesquisa e profissionais. Ajuda a coordenação a acompanhar sua produção."
    >
      <div className="space-y-3">
        <IdCard
          glifo={<GlifoTexto texto="iD" conectado={orcidValid} />}
          nome="ORCID iD"
          hint="Identificador único de pesquisador (16 dígitos)."
          conectado={orcidValid}
        >
          <CampoPrefixo prefixo="orcid.org/" valid={orcidValid}>
            <input
              value={form.orcid}
              onChange={(e) => set('orcid', formatarOrcid(e.target.value))}
              placeholder="0000-0000-0000-0000"
              className="h-9 flex-1 bg-transparent text-sm tabular-nums outline-none placeholder:text-muted-foreground"
            />
          </CampoPrefixo>
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={BookOpen} conectado={lattesValid} />}
          nome="Currículo Lattes"
          hint="Cole o link do seu currículo na Plataforma Lattes (CNPq)."
          conectado={lattesValid}
        >
          <CampoLink
            value={form.lattes}
            onChange={(v) => set('lattes', v)}
            placeholder="https://lattes.cnpq.br/0000000000000000"
            valid={lattesValid}
          />
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={GraduationCap} conectado={scholarValid} />}
          nome="Google Scholar"
          hint="Opcional."
          conectado={scholarValid}
        >
          <CampoLink
            value={form.scholar}
            onChange={(v) => set('scholar', v)}
            placeholder="scholar.google.com/citations?user=…"
            valid={scholarValid}
          />
        </IdCard>

        <Separator className="my-1" />

        <IdCard
          glifo={<GlifoIcone icon={Briefcase} conectado={linkedinValid} />}
          nome="LinkedIn"
          hint="Seu nome de usuário (após /in/)."
          conectado={linkedinValid}
        >
          <CampoPrefixo prefixo="linkedin.com/in/" valid={linkedinValid}>
            <input
              value={form.linkedin}
              onChange={(e) => set('linkedin', e.target.value.trim())}
              placeholder="seu-usuario"
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </CampoPrefixo>
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={LinkIcon} conectado={githubValid} />}
          nome="GitHub"
          hint="Opcional."
          conectado={githubValid}
        >
          <CampoPrefixo prefixo="github.com/" valid={githubValid}>
            <input
              value={form.github}
              onChange={(e) => set('github', e.target.value.trim())}
              placeholder="usuario"
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </CampoPrefixo>
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={Globe} conectado={siteValid} />}
          nome="Site / portfólio"
          hint="Opcional."
          conectado={siteValid}
        >
          <input
            value={form.site}
            onChange={(e) => set('site', e.target.value)}
            placeholder="https://…"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </IdCard>
      </div>
    </PerfilSectionCard>
  )
}

function IdCard({
  glifo,
  nome,
  hint,
  conectado,
  children,
}: {
  glifo: ReactNode
  nome: string
  hint?: string
  conectado: boolean
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2.5">
        {glifo}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-sm">{nome}</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs transition-colors',
                conectado
                  ? 'bg-success/10 text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <span className="inline-block size-1.5 rounded-full bg-current" />
              {conectado ? 'conectado' : 'não preenchido'}
            </span>
          </div>
          {hint && <div className="mt-0.5 text-muted-foreground text-xs">{hint}</div>}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function CampoLink({
  value,
  onChange,
  placeholder,
  valid,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  valid: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs focus-within:ring-2 focus-within:ring-ring">
      <LinkIcon className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <CheckSlot valid={valid} />
    </div>
  )
}

function CampoPrefixo({
  prefixo,
  valid,
  children,
}: {
  prefixo: string
  valid: boolean
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs focus-within:ring-2 focus-within:ring-ring">
      <span className="hidden max-w-40 shrink-0 truncate font-medium text-muted-foreground text-xs sm:inline-block">
        {prefixo}
      </span>
      {children}
      <CheckSlot valid={valid} />
    </div>
  )
}

/** Espaço fixo pra evitar layout shift quando o ✓ aparece/some. */
function CheckSlot({ valid }: { valid: boolean }) {
  return (
    <Check
      className={cn(
        'size-4 shrink-0 text-success transition-opacity',
        valid ? 'opacity-100' : 'opacity-0'
      )}
      strokeWidth={2.5}
      aria-hidden={!valid}
    />
  )
}
