import { ArrowRight, BookOpen, Calendar, Download } from 'lucide-react'

export function UFRRJCTA() {
  return (
    <section id="cta-ufrrj" className="border-t bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-5">
          {/* Manual */}
          <a
            href="#"
            className="group relative col-span-12 overflow-hidden rounded-2xl border bg-card p-10 transition-colors hover:bg-muted/20 md:col-span-7"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpen className="size-3.5" />
              Para começar
            </div>
            <h3 className="mt-4 text-balance font-serif font-medium text-[34px] leading-[1.08] tracking-[-0.015em]">
              Manual da Coordenação.
            </h3>
            <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
              52 páginas. Como acessar, ler e exportar do painel. Glossário Sinaes. Modelos prontos
              pra renovação de reconhecimento. Atualizado a cada novembro.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <Download className="size-4 text-primary" />
                Baixar PDF · 4,1 MB
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Edição maio/2026</span>
            </div>
          </a>

          {/* Schedule onboarding */}
          <a
            href="mailto:sae@prograd.ufrrj.br?subject=Agendar%20onboarding%20-%20SAE"
            className="group relative col-span-12 overflow-hidden rounded-2xl bg-portal-ink p-10 text-portal-ink-foreground transition-colors hover:bg-portal-ink/95 md:col-span-5"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/60">
              <Calendar className="size-3.5" />
              Onboarding presencial
            </div>
            <h3 className="mt-4 text-balance font-serif font-medium text-[28px] leading-[1.1] tracking-[-0.015em]">
              Agende uma sessão com a equipe SAE.
            </h3>
            <p className="mt-3 text-pretty text-[14px] leading-relaxed text-white/70">
              Uma hora, virtual ou na sala 217 do Pavilhão Central. Levamos a leitura do seu curso
              já pronta — você sai com um plano de uso.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              sae@prograd.ufrrj.br
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>

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
