import { Check, LineChart, type LucideIcon, Mail, Sparkles } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'
import { cn } from '~/lib/utils'

function PassoCard({
  tempo,
  titulo,
  copy,
  icon: Icon,
  primary = false,
}: {
  tempo: string
  titulo: string
  copy: string
  icon: LucideIcon
  primary?: boolean
}) {
  return (
    <li
      className={cn(
        'rounded-xl border p-5',
        primary ? 'border-primary/40 bg-primary/5' : 'bg-card'
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'grid size-9 place-items-center rounded-md',
            primary ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="size-4" />
        </div>
        <span className="font-serif text-sm font-medium text-primary tabular-nums">{tempo}</span>
      </div>
      <h3 className="mt-4 text-sm font-semibold leading-snug tracking-tight">{titulo}</h3>
      <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">{copy}</p>
    </li>
  )
}

export function EgressosEsforco() {
  return (
    <PortalSection>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionEyebrow>§ 02 · Esforço</SectionEyebrow>
          <SectionHeading className="mt-2">
            <span className="text-primary tabular-nums">30</span> segundos.{' '}
            <span className="font-normal italic text-foreground/85">Uma vez por ano.</span>
          </SectionHeading>
          <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            A gente sabe que você tem outras coisas pra fazer. Por isso o cadastro é desenhado pra
            caber no intervalo de um café. Você só responde “ainda” pros campos que não mudaram — e
            edita os que mudaram.
          </p>

          <div className="mt-7 flex items-baseline gap-2 text-sm">
            <span className="font-medium text-foreground">8 campos.</span>
            <span className="text-muted-foreground">
              Sempre os mesmos. Nada de questionário longo.
            </span>
          </div>
        </div>

        <div className="md:col-span-7">
          <ol className="grid gap-3 sm:grid-cols-3">
            <PassoCard
              tempo="~ 5s"
              titulo="Link no e-mail"
              copy="Sem senha. A gente manda o link, você clica."
              icon={Mail}
            />
            <PassoCard
              tempo="~ 20s"
              titulo="Confirmar 8 dados"
              copy="Tocar “ainda” ou editar. Sem campos abertos longos."
              icon={Check}
              primary
            />
            <PassoCard
              tempo="~ 5s"
              titulo="Pronto pra ler"
              copy="A leitura da sua turma já fica atualizada na hora."
              icon={LineChart}
            />
          </ol>

          <div className="mt-6 rounded-xl border bg-muted/40 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-brand-yellow/20 text-warning-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="text-pretty text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  Lembrete amigável uma vez por ano
                </span>{' '}
                — no mês do seu aniversário de formatura. Você pode silenciar se preferir. Não
                mandamos newsletter, nem promoção, nem pesquisa de satisfação.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalSection>
  )
}
