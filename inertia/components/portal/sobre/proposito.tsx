import { Flag, Leaf, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'

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
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{eyebrow}</div>
      </div>
      <h3 className="mt-5 text-balance font-serif text-2xl font-medium leading-tight tracking-tight">
        {title}
      </h3>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{body}</p>
    </article>
  )
}

export function SobreProposito() {
  return (
    <PortalSection surface="muted" border="bottom">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionEyebrow>§ 01</SectionEyebrow>
          <SectionHeading className="mt-2">Por que o SAE existe.</SectionHeading>
          <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Há duas razões — uma técnica, outra mais antiga. Elas se encontraram em 2014, na
            resolução que criou o programa.
          </p>
        </div>

        <div className="grid gap-6 md:col-span-8 md:grid-cols-2">
          <ReasonCard
            eyebrow="O dever institucional"
            icon={Flag}
            title="A Universidade precisa saber o que faz."
            body={
              <>
                O Sistema Nacional de Avaliação da Educação Superior (Sinaes/MEC) exige que cada IES
                acompanhe a trajetória profissional dos seus egressos. Isso alimenta a avaliação de
                cursos, a renovação de reconhecimento e a revisão dos projetos pedagógicos. Sem esse
                fio, a Universidade voa cega depois da colação.
              </>
            }
          />
          <ReasonCard
            eyebrow="O cuidado da casa"
            icon={Leaf}
            title="A Rural é uma comunidade que dura."
            body={
              <>
                Antes do MEC, era a tradição: turma de Agronomia que se reencontrava em Seropédica,
                redes de veterinários que se ajudavam na vida profissional, os antigos auxiliando os
                recém-formados. O SAE só dá uma forma sistemática ao que a UFRRJ já faz há um
                século.
              </>
            }
          />
        </div>
      </div>
    </PortalSection>
  )
}
