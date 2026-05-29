import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Check, Eye, Clock, Flag } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { PortalLogo } from '~/components/portal/logo'
import { Form } from '~/components/ui/form'
import { Button } from '~/components/ui/button'

// Props de página com objeto aninhado precisam ser `type` (não `interface`)
// para satisfazer a constraint de serialização do inertia.render.
type Identidade = {
  nome: string
  iniciais: string
  email: string
  matricula: string | null
  curso: string | null
  nivel: string | null
  campus: string | null
  turma: string | null
  colacao: string | null
  outrosVinculos: number
}

type OnboardingProps = {
  identidade: Identidade
}

/** Onboarding "É você?" — identidade pré-populada (SIGAA), confirmação em 1 toque. */
export default function Onboarding({ identidade }: OnboardingProps) {
  const formacao = [identidade.nivel, identidade.curso].filter(Boolean).join(' em ')

  return (
    <div className="portal-theme relative flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
      <Head title="É você? · SAE UFRRJ" />

      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link route="home" className="flex items-center gap-2.5">
            <PortalLogo />
            <span className="text-sm font-semibold tracking-tight">
              SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Identificado pela matrícula SIGAA
            <Check className="size-3.5 text-success-foreground" />
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-12">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            A UFRRJ acha que é você
          </div>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">É você?</h1>
        </div>

        {/* Card de identidade pré-populado */}
        <div className="mt-7 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-primary via-success to-brand-yellow" />
          <div className="p-7">
            <div className="flex items-start gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
                {identidade.iniciais}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Egresso{identidade.turma ? ` · Turma ${identidade.turma}` : ''}
                </div>
                <div className="mt-1 text-xl font-semibold tracking-tight">{identidade.nome}</div>
                {formacao && (
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {formacao}
                    {identidade.campus ? ` · ${identidade.campus}` : ''}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {identidade.matricula && (
                    <Detail label="Matrícula" value={identidade.matricula} />
                  )}
                  {identidade.turma && <Detail label="Turma" value={identidade.turma} />}
                  <Detail label="E-mail" value={identidade.email} />
                  {identidade.colacao && <Detail label="Colação" value={identidade.colacao} />}
                </div>

                {identidade.outrosVinculos > 0 && (
                  <div className="mt-4 text-xs text-muted-foreground">
                    + {identidade.outrosVinculos} outro
                    {identidade.outrosVinculos > 1 ? 's' : ''} vínculo
                    {identidade.outrosVinculos > 1 ? 's' : ''} acadêmico
                    {identidade.outrosVinculos > 1 ? 's' : ''} na UFRRJ
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t bg-muted/30 px-7 py-3 text-xs text-muted-foreground">
            Sabemos isso porque você entrou com o código enviado ao e-mail acima.
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Form route="onboarding.update">
            {({ processing }) => (
              <Button type="submit" size="xl" className="w-full" disabled={processing}>
                Sou eu — atualizar meus dados
                <ArrowRight />
              </Button>
            )}
          </Form>
          <Form route="session.destroy">
            <Button type="submit" variant="outline" className="w-full">
              Não sou eu
            </Button>
          </Form>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Algum dado acima está errado?{' '}
          <a
            href="mailto:sae@ufrrj.br"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Fale com a Coordenação
          </a>
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Sinal icon={<Eye className="size-3.5" />}>Não publicamos individualmente</Sinal>
          <span className="size-1 rounded-full bg-border" />
          <Sinal icon={<Clock className="size-3.5" />}>Cerca de 30 segundos</Sinal>
          <span className="size-1 rounded-full bg-border" />
          <Sinal icon={<Flag className="size-3.5" />}>MEC · LGPD</Sinal>
        </div>
      </main>
    </div>
  )
}

// Página standalone (traz o próprio shell); layout passthrough.
Onboarding.layout = (page: ReactElement) => page

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-medium">{value}</div>
    </div>
  )
}

function Sinal({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  )
}
