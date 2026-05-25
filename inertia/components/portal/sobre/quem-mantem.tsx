import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'

function PersonCard({
  fallback,
  name,
  role,
  dept,
}: {
  fallback: string
  name: string
  role: string
  dept: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <Avatar className="size-11 bg-primary/10">
          <AvatarFallback className="bg-primary/10 text-[13px] font-semibold text-primary">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-balance text-[14px] font-semibold leading-snug tracking-tight">
            {name}
          </div>
          <div className="mt-0.5 text-[12.5px] text-muted-foreground">{role}</div>
        </div>
      </div>
      <div className="mt-3.5 border-t pt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
        {dept}
      </div>
    </div>
  )
}

export function QuemMantem() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 04 · Equipe
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Quem mantém <span className="font-normal text-foreground/85 italic">o serviço.</span>
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              O SAE é uma equipe pequena dentro da PROGRAD. Trabalha em diálogo com as Coordenações
              dos 47 cursos e com um conselho consultivo de egressos e DCEs.
            </p>

            <div className="mt-6 rounded-xl border bg-muted/40 p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Contato direto
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5 text-muted-foreground" />
                  <a href="#" className="underline-offset-4 hover:underline">
                    sae@prograd.ufrrj.br
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Pavilhão Central, sala 217 · Seropédica
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <PersonCard
                fallback="MA"
                name="Profa. Marília Almeida"
                role="Coordenadora do SAE"
                dept="DLCS · PROGRAD"
              />
              <PersonCard
                fallback="JF"
                name="Prof. Jorge Fontoura"
                role="Adjunto / Metodologia"
                dept="Instituto de Educação"
              />
              <PersonCard
                fallback="RS"
                name="Renata Siqueira"
                role="Analista de dados"
                dept="DPADE"
              />
              <PersonCard
                fallback="LM"
                name="Lucas Maciel"
                role="Desenvolvimento da plataforma"
                dept="COINFO"
              />
              <PersonCard
                fallback="AC"
                name="Aline Coutinho"
                role="Comunicação institucional"
                dept="ASCOM"
              />
              <div className="flex flex-col rounded-xl border border-dashed bg-muted/30 p-5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  + Conselho consultivo
                </div>
                <p className="mt-2 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                  6 cadeiras rotativas: 2 representantes de DCEs, 2 egressos com mais de 5 anos de
                  formados, 2 docentes de áreas distintas.
                </p>
                <a
                  href="#"
                  className="mt-auto inline-flex items-center gap-1 pt-3 text-xs text-foreground underline-offset-4 hover:underline"
                >
                  Ver composição atual <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
