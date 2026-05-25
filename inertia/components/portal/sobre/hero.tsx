import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Book } from 'lucide-react'
import { PortalContainer } from '~/components/portal/container'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'

function IdRow({ term, def, last = false }: { term: string; def: string; last?: boolean }) {
  return (
    <div className={cn('flex items-baseline gap-3', !last && 'border-b pb-3.5')}>
      <dt className="w-28 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {term}
      </dt>
      <dd className="text-pretty text-sm leading-snug text-foreground">{def}</dd>
    </div>
  )
}

export function SobreHero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Subtle dotted texture, echoing the portal landing. */}
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="sobreDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sobreDots)" />
        </svg>
      </div>

      <PortalContainer className="relative pb-20 pt-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Sobre</span>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-10">
          <div className="col-span-12 flex flex-col gap-7 md:col-span-8">
            <SectionHeading as="h1" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Toda Universidade forma. <span className="text-primary">Poucas escutam</span>{' '}
              <span className="font-normal italic text-foreground/85">de volta.</span>
            </SectionHeading>

            <div className="max-w-2xl space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                O <strong className="font-medium text-foreground">SAE</strong> — Serviço de
                Acompanhamento de Egressos da UFRRJ — é a forma como a Rural ouve, sistematicamente,
                o que acontece com quem passou por aqui.
              </p>
              <p>
                Não é um sistema de RH. Não é uma rede social. É um instrumento institucional de
                escuta, mantido pela{' '}
                <strong className="font-medium text-foreground">Pró-Reitoria de Graduação</strong>,
                que devolve à Universidade — e aos próprios egressos — uma leitura honesta do que vem
                depois do diploma.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="#atuacao"
                className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
              >
                O que o SAE faz, exatamente <ArrowRight className="size-3.5" />
              </a>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Book className="size-3.5" /> Relatório anual disponível para download
              </span>
            </div>
          </div>

          {/* Institutional identity card */}
          <aside className="col-span-12 md:col-span-4">
            <div className="rounded-2xl border bg-card p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Programa
                </span>
                <SoftBadge>
                  <span className="inline-block size-1.5 rounded-full bg-success" />
                  Ativo
                </SoftBadge>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight">
                Serviço de Acompanhamento de Egressos
              </h2>

              <dl className="mt-5 space-y-3.5 text-sm">
                <IdRow term="Mantenedora" def="Pró-Reitoria de Graduação · UFRRJ" />
                <IdRow term="Fundação" def="2014 · Resolução CONSU 12/2014" />
                <IdRow term="Conformidade" def="Sinaes · MEC · LGPD" />
                <IdRow term="Cursos atendidos" def="47 graduações em 4 campi" />
                <IdRow term="Periodicidade" def="Atualização anual por egresso" last />
              </dl>
            </div>
          </aside>
        </div>
      </PortalContainer>
    </section>
  )
}
