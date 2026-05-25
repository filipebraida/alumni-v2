import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Eye } from 'lucide-react'
import { PortalContainer } from '~/components/portal/container'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { TransparenciaIndicadores } from '~/components/portal/transparencia/indicadores'

export function TransparenciaHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="trDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trDots)" />
        </svg>
      </div>

      <PortalContainer className="relative pb-16 pt-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Link route="home" className="hover:text-foreground">
            SAE · UFRRJ
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-foreground">Transparência</span>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-10">
          <div className="col-span-12 flex flex-col gap-7 md:col-span-8">
            <SoftBadge className="self-start">
              <Eye className="size-3" />
              Prestação de contas pública
            </SoftBadge>

            <SectionHeading as="h1" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
              A <span className="text-primary">cozinha aberta</span>{' '}
              <span className="font-normal italic text-foreground/85">do SAE.</span>
            </SectionHeading>

            <div className="max-w-xl space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              <p>
                Programa público se faz na vitrine, não no fundo da sala. Aqui ficam os relatórios
                anuais, a regra exata de como agregamos seus dados, quem tem acesso a o quê, e cada
                pedido LAI que respondemos.
              </p>
              <p>
                Se faltar alguma coisa, abre um pedido na Fala.BR — a UFRRJ tem 20 dias pra
                responder, e o SAE tenta responder em até 5.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a
                href="#relatorios"
                className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
              >
                Baixar relatórios <ArrowRight className="size-3.5" />
              </a>
              <a
                href="#lai"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Registro LAI
              </a>
              <a
                href="#anonimizacao"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                Regras de anonimização
              </a>
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4">
            <TransparenciaIndicadores />
          </aside>
        </div>
      </PortalContainer>

      {/* Cycle identity strip */}
      <div className="border-t bg-muted/30">
        <PortalContainer className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
            <span className="uppercase tracking-widest">Ciclo 2026 · em coleta</span>
          </div>
          <div className="font-mono text-muted-foreground">
            Última sincronização com SIGAA:{' '}
            <span className="text-foreground">24/mai/2026 · 03:12 BRT</span>
          </div>
        </PortalContainer>
      </div>
    </section>
  )
}
