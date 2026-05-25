import { ArrowRight, Leaf, User } from 'lucide-react'

export function EgressosCTA() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-330 px-8 py-20">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-12">
            <div className="relative col-span-12 p-10 md:col-span-7 md:p-14">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Última parada
              </div>
              <h3 className="mt-3 text-balance font-serif font-medium text-[44px] leading-[1.06] tracking-[-0.015em]">
                Pronto pra entrar?
              </h3>
              <p className="mt-4 max-w-md text-pretty text-[16px] leading-relaxed text-muted-foreground">
                Vai levar 30 segundos. Não vai pedir senha. Você pode sair na metade e voltar depois
                — a gente guarda onde parou.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/#login"
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Entrar com @ufrrj.br
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-md border bg-background px-6 text-sm font-medium hover:bg-muted/40"
                >
                  <User className="size-4 text-muted-foreground" />
                  Solicitar vínculo
                </a>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-8 select-none font-serif font-medium text-[180px] leading-none text-primary/[0.04]"
              >
                R
              </div>
            </div>

            <div className="col-span-12 flex flex-col bg-primary p-10 text-primary-foreground md:col-span-5 md:p-12">
              <Leaf className="size-6 text-brand-yellow" />
              <blockquote className="mt-6 text-pretty font-serif text-[22px] leading-[1.3] tracking-[-0.005em]">
                "Tem coisa que só faz sentido se a gente continuar contando. A UFRRJ tem mais de cem
                anos. Vamos seguir contando juntos."
              </blockquote>
              <div className="mt-auto border-t border-primary-foreground/15 pt-8">
                <div className="text-[13px] font-semibold">Profa. Marília Almeida</div>
                <div className="mt-0.5 text-[12px] text-primary-foreground/70">
                  Coordenadora do SAE · PROGRAD/UFRRJ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
