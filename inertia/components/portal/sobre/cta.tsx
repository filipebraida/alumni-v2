import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'

export function SobreCTA() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-330 px-8 py-20">
        <div className="grid grid-cols-12 gap-6">
          {/* Read the report */}
          <a
            href="#"
            className="group relative col-span-12 overflow-hidden rounded-2xl border bg-card p-10 transition-colors hover:bg-muted/20 md:col-span-7"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Para quem quiser olhar de perto
            </div>
            <h3 className="mt-3 text-balance font-serif font-medium text-[34px] leading-[1.1] tracking-[-0.015em]">
              Leia o Relatório SAE 2025.
            </h3>
            <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
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
              className="pointer-events-none absolute -right-6 -top-6 select-none font-serif font-medium text-[160px] leading-none text-primary/[0.04]"
            >
              ’25
            </div>
          </a>

          {/* Enter the panel */}
          <a
            href="/#login"
            className="group relative col-span-12 overflow-hidden rounded-2xl bg-portal-ink p-10 text-portal-ink-foreground transition-colors hover:bg-portal-ink/95 md:col-span-5"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Para quem se formou na Rural
            </div>
            <h3 className="mt-3 text-balance font-serif font-medium text-[34px] leading-[1.1] tracking-[-0.015em]">
              Entre no seu painel.
            </h3>
            <p className="mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-white/70">
              Acesso pelo e-mail @ufrrj.br cadastrado pela sua Coordenação. Sem senha pra criar.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Acessar o SAE
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>

            {/* Crest yellow dot */}
            <span
              aria-hidden
              className="absolute right-8 top-8 size-2 rounded-full bg-brand-yellow"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
