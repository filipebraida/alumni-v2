import { Eye, Globe, Leaf, type LucideIcon } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'

const items: { icon: LucideIcon; title: string; copy: string }[] = [
  {
    icon: Eye,
    title: 'Seus dados, sob o seu controle',
    copy: 'Você decide o que aparece no seu perfil público da Rural. O resto vive só em análises agregadas.',
  },
  {
    icon: Leaf,
    title: 'Vinculado à Pró-Reitoria de Graduação',
    copy: 'O SAE é mantido pela PROGRAD/UFRRJ — não é uma rede social, não vende sua atenção.',
  },
  {
    icon: Globe,
    title: 'Aberto a egressos em todo lugar',
    copy: 'Se você se formou em Seropédica, Nova Iguaçu, Três Rios ou Campos, sua trajetória conta aqui.',
  },
]

export function EntradaGarantias() {
  return (
    <PortalSection containerClassName="py-16">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
        {items.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="bg-card p-7">
            <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <h3 className="mt-4 text-sm font-semibold leading-snug tracking-tight">{title}</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </PortalSection>
  )
}
