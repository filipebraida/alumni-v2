import { ArrowRight, Eye, Leaf } from 'lucide-react'
import { PortalContainer } from '~/components/portal/container'
import { EntradaLoginCard } from '~/components/portal/entrada/login_card'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'

function Stat({ n, label, muted = false }: { n: string; label: string; muted?: boolean }) {
  return (
    <div>
      <div
        className={cn(
          'font-serif text-3xl font-medium leading-none tracking-tight tabular-nums',
          muted ? 'text-foreground/85' : 'text-primary'
        )}
      >
        {n}
      </div>
      <div className="mt-1.5 text-xs leading-snug text-muted-foreground">{label}</div>
    </div>
  )
}

export function EntradaHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="portalDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#portalDots)" />
        </svg>
      </div>

      <PortalContainer className="relative grid grid-cols-12 gap-10 pb-20 pt-16">
        <div className="col-span-12 flex flex-col gap-6 pt-2 md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <SoftBadge>
              <Leaf className="size-3" />
              Programa institucional · UFRRJ
            </SoftBadge>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Em conformidade com o MEC
            </span>
          </div>

          <SectionHeading as="h1" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
            Você se formou.
            <br />
            <span className="text-primary">A UFRRJ continua</span>
            <br />
            <span className="font-normal italic text-foreground/85">com você.</span>
          </SectionHeading>

          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            O <strong className="font-medium text-foreground">SAE</strong> — Serviço de
            Acompanhamento de Egressos — é como a Rural mantém contato com quem passou por aqui.
            Você atualiza <strong className="font-medium text-foreground">8 dados</strong> uma vez
            por ano, e em troca recebe análises da sua turma, reencontra colegas e ajuda a
            Universidade a melhorar os cursos.
          </p>

          <div className="mt-2 grid max-w-xl grid-cols-3 gap-6 border-y py-5">
            <Stat n="4.802" label="egressos cadastrados" />
            <Stat n="47" label="cursos acompanhados" />
            <Stat n="12 anos" label="de mapeamento contínuo" muted />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a
              href="#passos"
              className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
            >
              Como funciona <ArrowRight className="size-3.5" />
            </a>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" /> Dados sempre anônimos no agregado
            </span>
          </div>
        </div>

        <div id="login" className="col-span-12 md:col-span-5">
          <EntradaLoginCard />
        </div>
      </PortalContainer>
    </section>
  )
}
