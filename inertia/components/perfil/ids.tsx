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
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/types'

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
 * marca, pra manter a consistência visual.
 */
export function PerfilIds({ form, set }: Props) {
  const orcidValid = form.orcid.replace(/[^0-9X]/gi, '').length === 16
  const lattesValid =
    /lattes\.cnpq\.br\/\d{16}/.test(form.lattes) || /^\d{16}$/.test(form.lattes.trim())

  return (
    <PerfilSectionCard
      id="ids"
      icon={Award}
      title="Identificadores acadêmicos"
      description="Conecte seus perfis de pesquisa e profissionais. Ajuda a coordenação a acompanhar sua produção."
    >
      <div className="space-y-3">
        <IdCard
          glifo={<GlifoTexto texto="iD" tom="success" />}
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
          glifo={<GlifoIcone icon={BookOpen} tom="primary" />}
          nome="Currículo Lattes"
          hint="Cole o link do seu currículo na Plataforma Lattes (CNPq)."
          conectado={lattesValid}
        >
          <CampoLink
            value={form.lattes}
            onChange={(v) => set('lattes', v)}
            placeholder="http://lattes.cnpq.br/0000000000000000"
            valid={lattesValid}
          />
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={GraduationCap} tom="primary" />}
          nome="Google Scholar"
          hint="Opcional."
          conectado={!!form.scholar.trim()}
        >
          <CampoLink
            value={form.scholar}
            onChange={(v) => set('scholar', v)}
            placeholder="scholar.google.com/citations?user=…"
            valid={!!form.scholar.trim()}
          />
        </IdCard>

        <Separator className="my-1" />

        <IdCard
          glifo={<GlifoIcone icon={Briefcase} tom="primary" />}
          nome="LinkedIn"
          hint="Seu nome de usuário (após /in/)."
          conectado={!!form.linkedin.trim()}
        >
          <CampoPrefixo prefixo="linkedin.com/in/" valid={!!form.linkedin.trim()}>
            <input
              value={form.linkedin}
              onChange={(e) => set('linkedin', e.target.value.trim())}
              placeholder="seu-usuario"
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </CampoPrefixo>
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={LinkIcon} tom="muted" />}
          nome="GitHub"
          hint="Opcional."
          conectado={!!form.github.trim()}
        >
          <CampoPrefixo prefixo="github.com/" valid={!!form.github.trim()}>
            <input
              value={form.github}
              onChange={(e) => set('github', e.target.value.trim())}
              placeholder="usuario"
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </CampoPrefixo>
        </IdCard>

        <IdCard
          glifo={<GlifoIcone icon={Globe} tom="muted" />}
          nome="Site / portfólio"
          hint="Opcional."
          conectado={!!form.site.trim()}
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{nome}</span>
            {conectado ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 font-medium text-success-foreground text-xs">
                <span className="inline-block size-1.5 rounded-full bg-current" /> conectado
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">não preenchido</span>
            )}
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
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 shadow-xs focus-within:ring-2 focus-within:ring-ring">
      <LinkIcon className="size-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      {valid && <Check className="size-4 text-success" strokeWidth={2.5} />}
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
    <div className="flex items-center gap-2 rounded-md border border-input bg-background pl-3 shadow-xs focus-within:ring-2 focus-within:ring-ring">
      <span className="font-medium text-muted-foreground text-xs">{prefixo}</span>
      {children}
      {valid && <Check className="me-3 size-4 text-success" strokeWidth={2.5} />}
    </div>
  )
}

function GlifoTexto({ texto, tom }: { texto: string; tom: 'primary' | 'success' | 'muted' }) {
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-md font-bold text-sm',
        tomCls(tom)
      )}
    >
      {texto}
    </span>
  )
}

function GlifoIcone({
  icon: Icon,
  tom,
}: {
  icon: typeof Briefcase
  tom: 'primary' | 'success' | 'muted'
}) {
  return (
    <span className={cn('grid size-9 shrink-0 place-items-center rounded-md', tomCls(tom))}>
      <Icon className="size-4" />
    </span>
  )
}

function tomCls(tom: 'primary' | 'success' | 'muted') {
  if (tom === 'primary') return 'bg-primary/10 text-primary'
  if (tom === 'success') return 'bg-success/10 text-success-foreground'
  return 'bg-muted text-muted-foreground'
}
