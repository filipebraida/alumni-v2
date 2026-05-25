import { Flag, Leaf, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

function ReasonCard({
  eyebrow,
  icon: Icon,
  title,
  body,
}: {
  eyebrow: string
  icon: LucideIcon
  title: string
  body: ReactNode
}) {
  return (
    <article className="relative rounded-2xl border bg-card p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </div>
      </div>
      <h3 className="mt-5 text-balance font-serif font-medium text-[22px] leading-[1.2] tracking-[-0.01em]">
        {title}
      </h3>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  )
}

export function PorQueExiste() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-330 px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 01
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Por que o SAE existe.
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Há duas razões — uma técnica, outra mais antiga. Elas se encontraram em 2014, na
              resolução que criou o programa.
            </p>
          </div>

          <div className="col-span-12 grid gap-6 md:col-span-8 md:grid-cols-2">
            <ReasonCard
              eyebrow="O dever institucional"
              icon={Flag}
              title="A Universidade precisa saber o que faz."
              body={
                <>
                  O Sistema Nacional de Avaliação da Educação Superior (Sinaes/MEC) exige que cada
                  IES acompanhe a trajetória profissional dos seus egressos. Isso alimenta a
                  avaliação de cursos, a renovação de reconhecimento e a revisão dos projetos
                  pedagógicos. Sem esse fio, a Universidade voa cega depois da colação.
                </>
              }
            />
            <ReasonCard
              eyebrow="O cuidado da casa"
              icon={Leaf}
              title="A Rural é uma comunidade que dura."
              body={
                <>
                  Antes do MEC, era a tradição: turma de Agronomia que se reencontrava em
                  Seropédica, redes de veterinários que se ajudavam na vida profissional, os antigos
                  auxiliando os recém-formados. O SAE só dá uma forma sistemática ao que a UFRRJ já
                  faz há um século.
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
