import { ArrowRight, Eye, Leaf } from 'lucide-react'
import { LoginCard } from '~/components/portal/entrada/login-card'
import { SoftBadge } from '~/components/portal/soft-badge'
import { cn } from '~/lib/utils'

function Stat({ n, label, muted = false }: { n: string; label: string; muted?: boolean }) {
  return (
    <div>
      <div
        className={cn(
          'font-serif font-medium text-[34px] leading-none tracking-[-0.01em] tabular-nums',
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
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="portalDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#portalDots)" />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-330 grid-cols-12 gap-10 px-8 pb-20 pt-16">
        <div className="col-span-12 flex flex-col gap-6 pt-2 md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <SoftBadge>
              <Leaf className="size-3" />
              Programa institucional · UFRRJ
            </SoftBadge>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Em conformidade com o MEC
            </span>
          </div>

          <h1 className="font-serif font-medium text-[clamp(40px,5.5vw,72px)] leading-[1.04] tracking-[-0.015em] text-foreground">
            Você se formou.
            <br />
            <span className="text-primary">A UFRRJ continua</span>
            <br />
            <span className="font-normal text-foreground/85 italic">com você.</span>
          </h1>

          <p className="max-w-xl text-pretty text-[17px] leading-relaxed text-muted-foreground">
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
              href="#como-funciona"
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
          <LoginCard />
        </div>
      </div>
    </section>
  )
}
