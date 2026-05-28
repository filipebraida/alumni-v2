import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, User } from 'lucide-react'
import { PortalContainer } from '~/components/portal/container'
import { EgressosPassaporte } from '~/components/portal/egressos/passaporte'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'

export function EgressosHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="egDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#egDots)" />
        </svg>
      </div>

      <PortalContainer className="relative pb-20 pt-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Para egressos</span>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          <div className="flex flex-col gap-7 md:col-span-7">
            <SoftBadge className="self-start">
              <User className="size-3" />
              Para quem se formou na Rural
            </SoftBadge>

            <SectionHeading as="h1" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Você passou anos aqui. <span className="text-primary">A Rural ainda te</span>{' '}
              <span className="font-normal italic text-foreground/85">deve uma coisa.</span>
            </SectionHeading>

            <div className="max-w-xl space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
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

          <aside className="md:col-span-5 md:pl-4">
            <EgressosPassaporte />
          </aside>
        </div>
      </PortalContainer>
    </section>
  )
}
