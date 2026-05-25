import { ArrowUpRight, Globe, Mail } from 'lucide-react'

export function TransCTA() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-5">
          {/* Fala.BR — primary */}
          <a
            href="#"
            className="group relative col-span-12 overflow-hidden rounded-2xl bg-primary p-10 text-primary-foreground transition-colors hover:bg-primary/95 md:col-span-7 md:p-12"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground/70">
              <Globe className="size-3.5" />
              Não achou o que procurava?
            </div>
            <h3 className="mt-4 text-balance font-serif font-medium text-[40px] leading-[1.06] tracking-[-0.015em]">
              Faça um pedido pela{' '}
              <span className="text-brand-yellow">Lei de Acesso à Informação.</span>
            </h3>
            <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-primary-foreground/80">
              A Fala.BR é o canal oficial. A UFRRJ tem 20 dias para responder, prorrogáveis por mais
              10 com justificativa. O pedido pode ser anônimo.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
              Abrir pedido em falabr.cgu.gov.br
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-4 -right-2 select-none font-serif font-medium text-[180px] leading-none text-primary-foreground/[0.04]"
            >
              LAI
            </div>
          </a>

          {/* Ouvidoria */}
          <a
            href="mailto:ouvidoria@ufrrj.br"
            className="group relative col-span-12 overflow-hidden rounded-2xl border bg-card p-10 transition-colors hover:bg-muted/20 md:col-span-5"
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Mail className="size-3.5" />
              Canal direto
            </div>
            <h3 className="mt-4 text-balance font-serif font-medium text-[28px] leading-[1.1] tracking-[-0.015em]">
              Falar com a Ouvidoria da UFRRJ.
            </h3>
            <p className="mt-3 text-pretty text-[14px] leading-relaxed text-muted-foreground">
              Pra reclamação, elogio, denúncia ou sugestão sobre o SAE. Respondemos em até 10 dias
              úteis.
            </p>
            <div className="mt-6 font-mono text-[13px] text-foreground">ouvidoria@ufrrj.br</div>

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
