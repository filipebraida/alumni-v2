import { PortalSection } from '~/components/portal/section'
import { SectionHeader } from '~/components/portal/section_header'
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

export function UfrrjCalendario() {
  return (
    <PortalSection>
      <SectionHeader
        eyebrow="§ 04 · Ritmo anual"
        aside="Cada momento do ano tem o seu entregável. Você não precisa pedir — chega pronto."
      >
        O SAE acompanha{' '}
        <span className="font-normal italic text-foreground/85">o calendário da Universidade.</span>
      </SectionHeader>

      <div className="relative mt-12">
        {/* Horizontal rail aligned to the bullet centers (desktop only). */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-13 hidden h-px bg-border md:block"
        />

        <ol className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-6">
          {milestones.map((m) => (
            <li key={m.month} className="relative">
              <div className="font-serif text-2xl font-medium uppercase leading-none tracking-tight text-muted-foreground tabular-nums">
                {m.month}
              </div>

              <span
                className={cn(
                  'relative z-10 mt-5 hidden size-4 place-items-center rounded-full border-2 bg-background md:grid',
                  markerBorder[m.tone]
                )}
              >
                {m.tone === 'now' && <span className="size-2 rounded-full bg-primary" />}
                {m.tone === 'yellow' && <span className="size-2 rounded-full bg-brand-yellow" />}
              </span>

              <h3
                className={cn(
                  'mt-3 text-balance text-sm font-semibold leading-snug tracking-tight',
                  m.tone === 'muted' && 'text-muted-foreground'
                )}
              >
                {m.label}
              </h3>
              <p className="mt-1.5 text-pretty text-xs leading-relaxed text-muted-foreground">
                {m.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </PortalSection>
  )
}
