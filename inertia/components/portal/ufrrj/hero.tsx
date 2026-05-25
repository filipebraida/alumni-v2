import { ArrowRight, Download, GraduationCap } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { SoftBadge } from '~/components/portal/soft-badge'
import { DashboardPreview } from '~/components/portal/ufrrj/dashboard-preview'

export function UFRRJHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ufDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ufDots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1320px] px-8 pb-20 pt-16">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Para a UFRRJ</span>
        </div>

        <div className="mt-8 grid grid-cols-12 items-start gap-10">
          <div className="col-span-12 flex flex-col gap-7 md:col-span-7">
            <SoftBadge className="self-start">
              <GraduationCap className="size-3" />
              Para Coordenações, NDE, Chefias e PROGRAD
            </SoftBadge>

            <h1 className="text-balance font-serif font-medium text-[clamp(38px,4.8vw,64px)] leading-[1.04] tracking-[-0.015em] text-foreground">
              A Universidade <span className="text-primary">que escuta de volta</span>{' '}
              <span className="font-normal text-foreground/85 italic">revisa melhor.</span>
            </h1>

            <div className="max-w-[600px] space-y-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">
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
                href="#deliverables"
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

          <aside className="col-span-12 md:col-span-5 md:pl-4">
            <DashboardPreview />
          </aside>
        </div>
      </div>
    </section>
  )
}
