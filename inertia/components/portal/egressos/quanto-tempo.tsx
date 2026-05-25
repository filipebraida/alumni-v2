import { Check, LineChart, LucideIcon, Mail, Sparkles } from 'lucide-react'
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
        primary ? 'border-primary/40 bg-primary/[0.04]' : 'bg-card'
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
        <span className="font-serif font-medium text-[15px] text-primary tabular-nums">
          {tempo}
        </span>
      </div>
      <h3 className="mt-4 text-[14px] font-semibold leading-snug tracking-tight">{titulo}</h3>
      <p className="mt-1 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">{copy}</p>
    </li>
  )
}

export function QuantoTempo() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 02 · Esforço
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              <span className="text-primary tabular-nums">30</span> segundos.{' '}
              <span className="font-normal text-foreground/85 italic">Uma vez por ano.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
              A gente sabe que você tem outras coisas pra fazer. Por isso o cadastro é desenhado pra
              caber no intervalo de um café. Você só responde "ainda" pros campos que não mudaram —
              e edita os que mudaram.
            </p>

            <div className="mt-7 flex items-baseline gap-2 text-sm">
              <span className="font-medium text-foreground">8 campos.</span>
              <span className="text-muted-foreground">
                Sempre os mesmos. Nada de questionário longo.
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
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
                copy={'Tocar "ainda" ou editar. Sem campos abertos longos.'}
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
                <div className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
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
      </div>
    </section>
  )
}
