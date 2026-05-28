import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Download, GraduationCap } from 'lucide-react'
import { PortalContainer } from '~/components/portal/container'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { UfrrjPainel } from '~/components/portal/ufrrj/painel'

export function UfrrjHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ufDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ufDots)" />
        </svg>
      </div>

      <PortalContainer className="relative pb-20 pt-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Para a UFRRJ</span>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          <div className="flex flex-col gap-7 md:col-span-7">
            <SoftBadge className="self-start">
              <GraduationCap className="size-3" />
              Para Coordenações, NDE, Chefias e PROGRAD
            </SoftBadge>

            <SectionHeading as="h1" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
              A Universidade <span className="text-primary">que escuta de volta</span>{' '}
              <span className="font-normal italic text-foreground/85">revisa melhor.</span>
            </SectionHeading>

            <div className="max-w-xl space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                Você está revisando o PPC do seu curso. Vai pleitear renovação de reconhecimento.
                Vai justificar uma reforma curricular ao CONSEPE. Em todos esses momentos, a
                pergunta volta:{' '}
                <em className="font-medium text-foreground not-italic">
                  "e os nossos egressos, como estão?"
                </em>
              </p>
              <p>
                O SAE existe pra que essa pergunta tenha resposta — não anedótica, não opinativa,
                com 12 anos de série histórica. Pronta pra entrar no seu relato de gestão.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="#contrapartida"
                className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ver o que o SAE devolve <ArrowRight className="size-3.5" />
              </a>
              <a
                href="#cta-ufrrj"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Download className="size-3.5" />
                Manual para Coordenações
              </a>
            </div>
          </div>

          <aside className="md:col-span-5 md:pl-4">
            <UfrrjPainel />
          </aside>
        </div>
      </PortalContainer>
    </section>
  )
}
