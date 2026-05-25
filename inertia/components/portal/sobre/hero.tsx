import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Book } from 'lucide-react'
import { cn } from '~/lib/utils'

function IdRow({ term, def, last = false }: { term: string; def: string; last?: boolean }) {
  return (
    <div className={cn('flex items-baseline gap-3', !last && 'border-b pb-3.5')}>
      <dt className="w-28 shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
        {term}
      </dt>
      <dd className="text-pretty text-[13px] leading-snug text-foreground">{def}</dd>
    </div>
  )
}

export function SobreHero() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Subtle dotted texture, echoing the portal landing. */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="sobreDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sobreDots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-330 px-8 pb-20 pt-16">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Sobre</span>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-10">
          <div className="col-span-12 flex flex-col gap-7 md:col-span-8">
            <h1 className="text-balance font-serif font-medium text-[clamp(40px,5.2vw,68px)] leading-[1.04] tracking-[-0.015em] text-foreground">
              Toda Universidade forma. <span className="text-primary">Poucas escutam</span>{' '}
              <span className="font-normal text-foreground/85 italic">de volta.</span>
            </h1>

            <div className="max-w-160 space-y-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">
              <p>
                O <strong className="font-medium text-foreground">SAE</strong> — Serviço de
                Acompanhamento de Egressos da UFRRJ — é a forma como a Rural ouve, sistematicamente,
                o que acontece com quem passou por aqui.
              </p>
              <p>
                Não é um sistema de RH. Não é uma rede social. É um instrumento institucional de
                escuta, mantido pela{' '}
                <strong className="font-medium text-foreground">Pró-Reitoria de Graduação</strong>,
                que devolve à Universidade — e aos próprios egressos — uma leitura honesta do que
                vem depois do diploma.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="#o-que-fazemos"
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
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Programa
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <span className="inline-block size-1.5 rounded-full bg-success" />
                  Ativo
                </span>
              </div>

              <h2 className="mt-3 font-serif font-medium text-[22px] leading-[1.2] tracking-[-0.01em]">
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
      </div>
    </section>
  )
}
