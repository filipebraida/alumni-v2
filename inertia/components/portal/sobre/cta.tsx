import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'

export function SobreCta() {
  return (
    <PortalSection>
      <div className="grid grid-cols-12 gap-6">
        {/* Read the report */}
        <a
          href="#"
          className="group relative col-span-12 overflow-hidden rounded-2xl border bg-card p-10 transition-colors hover:bg-muted/20 md:col-span-7"
        >
          <SectionEyebrow>Para quem quiser olhar de perto</SectionEyebrow>
          <h3 className="mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-tight">
            Leia o Relatório SAE 2025.
          </h3>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            136 páginas com a leitura completa: empregabilidade por curso, mediana salarial,
            continuidade na pós-graduação, mobilidade geográfica. Aberto, em PDF.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm font-medium text-foreground">
            <span className="inline-flex items-center gap-2">
              <Download className="size-4 text-primary" />
              Baixar PDF · 8,2 MB
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              Microdados em CSV <ArrowUpRight className="size-3" />
            </span>
          </div>

          {/* Editorial watermark */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 select-none font-serif text-9xl font-medium leading-none text-primary/5"
          >
            ’25
          </div>
        </a>

        {/* Enter the panel */}
        <Link
          href="/#login"
          className="group relative col-span-12 overflow-hidden rounded-2xl bg-portal-ink p-10 text-portal-ink-foreground transition-colors hover:bg-portal-ink/95 md:col-span-5"
        >
          <div className="text-xs uppercase tracking-widest text-white/60">
            Para quem se formou na Rural
          </div>
          <h3 className="mt-3 text-balance font-serif text-3xl font-medium leading-tight tracking-tight">
            Entre no seu painel.
          </h3>
          <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-white/70">
            Acesso pelo e-mail @ufrrj.br cadastrado pela sua Coordenação. Sem senha pra criar.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
            Acessar o SAE
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>

          {/* Crest yellow dot */}
          <span aria-hidden className="absolute right-8 top-8 size-2 rounded-full bg-brand-yellow" />
        </Link>
      </div>
    </PortalSection>
  )
}
