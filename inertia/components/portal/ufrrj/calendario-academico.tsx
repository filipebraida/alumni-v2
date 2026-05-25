import { cn } from '~/lib/utils'

type Tone = 'primary' | 'now' | 'yellow' | 'plain' | 'muted'

const milestones: { month: string; label: string; copy: string; tone: Tone }[] = [
  {
    month: 'mar',
    label: 'Janela anual abre',
    copy: 'Egressos recebem o convite anual de atualização. Lembrete amigável uma vez.',
    tone: 'primary',
  },
  {
    month: 'mai',
    label: 'Curva de coleta',
    copy: 'Pico de respostas. Painel da Coordenação já mostra dado fresco em tempo real.',
    tone: 'plain',
  },
  {
    month: 'ago',
    label: 'Devolutiva por curso',
    copy: 'Coordenações recebem o recorte do próprio curso, com comparativos.',
    tone: 'now',
  },
  {
    month: 'out',
    label: 'Sessões NDE',
    copy: 'Janela em que o SAE alimenta diretamente o trabalho dos núcleos docentes.',
    tone: 'plain',
  },
  {
    month: 'nov',
    label: 'Relatório anual público',
    copy: 'Publicação no site institucional. Microdados em CSV. Apresentação ao Conselho.',
    tone: 'yellow',
  },
  {
    month: 'jan',
    label: 'Encerra ciclo',
    copy: 'Consolidação histórica e preparo dos modelos pra próxima janela.',
    tone: 'muted',
  },
]

const markerBorder: Record<Tone, string> = {
  now: 'border-primary',
  yellow: 'border-brand-yellow',
  primary: 'border-primary/50',
  muted: 'border-muted-foreground/30',
  plain: 'border-border',
}

export function CalendarioAcademico() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 04 · Ritmo anual
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              O SAE acompanha{' '}
              <span className="font-normal text-foreground/85 italic">
                o calendário da Universidade.
              </span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-5 md:text-right">
            Cada momento do ano tem o seu entregável. Você não precisa pedir — chega pronto.
          </div>
        </div>

        <div className="relative mt-12">
          {/* Horizontal rail aligned to the bullet centers. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[50px] hidden h-px bg-border md:block"
          />

          <ol className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-6">
            {milestones.map((m) => (
              <li key={m.month} className="relative">
                <div className="font-serif font-medium text-[22px] uppercase leading-none tracking-[-0.01em] text-muted-foreground tabular-nums">
                  {m.month}
                </div>

                <span
                  className={cn(
                    'relative z-10 mt-5 hidden size-[17px] place-items-center rounded-full border-2 bg-background md:grid',
                    markerBorder[m.tone]
                  )}
                >
                  {m.tone === 'now' && <span className="size-[7px] rounded-full bg-primary" />}
                  {m.tone === 'yellow' && (
                    <span className="size-[7px] rounded-full bg-brand-yellow" />
                  )}
                </span>

                <h3
                  className={cn(
                    'mt-3 text-balance text-[15px] font-semibold leading-snug tracking-tight',
                    m.tone === 'muted' && 'text-muted-foreground'
                  )}
                >
                  {m.label}
                </h3>
                <p className="mt-1.5 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                  {m.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
