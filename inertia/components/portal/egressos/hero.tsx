import { ArrowRight, User } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { SoftBadge } from '~/components/portal/soft-badge'
import { Passaporte } from '~/components/portal/egressos/passaporte'

export function EgressosHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="egDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#egDots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1320px] px-8 pb-20 pt-16">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Para egressos</span>
        </div>

        <div className="mt-8 grid grid-cols-12 items-start gap-10">
          <div className="col-span-12 flex flex-col gap-7 md:col-span-7">
            <SoftBadge className="self-start">
              <User className="size-3" />
              Para quem se formou na Rural
            </SoftBadge>

            <h1 className="text-balance font-serif font-medium text-[clamp(40px,5.2vw,68px)] leading-[1.04] tracking-[-0.015em] text-foreground">
              Você passou anos aqui. <span className="text-primary">A Rural ainda te</span>{' '}
              <span className="font-normal text-foreground/85 italic">deve uma coisa.</span>
            </h1>

            <div className="max-w-[600px] space-y-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">
              <p>
                Te deve a leitura honesta de pra onde foi a sua turma. Te deve uma rede de quem
                passou pelos mesmos corredores que você. Te deve um canal direto pra quando você
                precisar de uma declaração, uma indicação, ou só voltar pra Seropédica num sábado de
                outubro.
              </p>
              <p className="text-foreground">O SAE é como a gente paga essa conta.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="#beneficios"
                className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ver o que você recebe <ArrowRight className="size-3.5" />
              </a>
              <a
                href="#perguntas"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Perguntas frequentes
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-5 md:pl-4">
            <Passaporte />
          </aside>
        </div>
      </div>
    </section>
  )
}
