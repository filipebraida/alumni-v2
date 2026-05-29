import { ArrowRight, Eye, Leaf } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { type ReactNode } from 'react'
import { EightFieldsRule } from '~/components/portal/entrada/eight_fields_rule'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

/**
 * Hero v3 "calma" — single centered column. No inline login, no side column:
 * the login lives on its own page, reached via the CTA. The only extra visual
 * is a typographic ruler under "8 dados" that anchors the gesture.
 */
export function EntradaHero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle dot texture */}
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
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-16 text-center sm:pb-28 sm:pt-24 md:pt-32">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SoftBadge>
            <Leaf className="size-3" />
            Programa institucional · UFRRJ
          </SoftBadge>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Em conformidade com o MEC
          </span>
        </div>

        <SectionHeading as="h1" className="mt-8 text-4xl sm:text-6xl sm:leading-none md:text-7xl">
          Você se formou.
          <br />
          <span className="text-primary">A UFRRJ continua</span>{' '}
          <span className="italic font-normal text-foreground/85">com você.</span>
        </SectionHeading>

        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          O <strong className="font-medium text-foreground">SAE</strong> — Serviço de Acompanhamento
          de Egressos — é como a Rural mantém contato com quem passou por aqui. Uma vez por ano,
          você confirma <Annotated>8 dados</Annotated> e, em troca, recebe análises da sua turma,
          reencontra colegas e ajuda a Universidade a melhorar os cursos.
        </p>

        <EightFieldsRule />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link route="session.create" className={cn(buttonVariants({ size: 'xl' }), 'group')}>
            Entrar com e-mail @ufrrj.br
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#passos" className={buttonVariants({ variant: 'outline', size: 'xl' })}>
            Como funciona
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-brand-yellow" />
            12 anos de mapeamento contínuo
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" /> Dados sempre anônimos no agregado
          </span>
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Leaf className="size-3.5" /> Vinculado à PROGRAD
          </span>
        </div>
      </div>
    </section>
  )
}

/** Wavy brand-yellow underline marking the "8 dados" annotation. */
function Annotated({ children }: { children: ReactNode }) {
  return (
    <span className="relative whitespace-nowrap font-medium text-foreground">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 60 6"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-1 left-0 h-1.5 w-full text-brand-yellow"
      >
        <path
          d="M0 3 Q 7.5 0 15 3 T 30 3 T 45 3 T 60 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
