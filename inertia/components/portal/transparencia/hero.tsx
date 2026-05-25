import { ArrowRight, Eye } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { SoftBadge } from '~/components/portal/soft-badge'
import { IndicadoresAoVivo } from '~/components/portal/transparencia/indicadores-ao-vivo'

export function TransHero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="trDots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trDots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1320px] px-8 pb-16 pt-16">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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

            <h1 className="text-balance font-serif font-medium text-[clamp(40px,5.2vw,68px)] leading-[1.04] tracking-[-0.015em] text-foreground">
              A <span className="text-primary">cozinha aberta</span>{' '}
              <span className="font-normal text-foreground/85 italic">do SAE.</span>
            </h1>

            <div className="max-w-[600px] space-y-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">
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
            <IndicadoresAoVivo />
          </aside>
        </div>
      </div>

      {/* Cycle identity strip */}
      <div className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-8 py-4 text-[12px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] uppercase tracking-[0.16em]">Ciclo 2026 · em coleta</span>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            Última sincronização com SIGAA:{' '}
            <span className="text-foreground">24/mai/2026 · 03:12 BRT</span>
          </div>
        </div>
      </div>
    </section>
  )
}
