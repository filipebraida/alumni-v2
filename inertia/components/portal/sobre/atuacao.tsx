import { BookOpen, LineChart, LucideIcon, Sparkles, Users } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionHeader } from '~/components/portal/section_header'

const items: { n: string; icon: LucideIcon; title: string; copy: string }[] = [
  {
    n: '01',
    icon: Users,
    title: 'Mantém o cadastro vivo.',
    copy: 'Cada egresso confirma 8 dados uma vez por ano — endereço, ocupação, faixa salarial, situação acadêmica. É um pulso anual, não um cadastro fóssil.',
  },
  {
    n: '02',
    icon: LineChart,
    title: 'Publica relatórios abertos.',
    copy: 'Empregabilidade, salário mediano, taxa de continuidade na pós, tempo até o 1º emprego — sempre agregados por curso e por ano. Qualquer um pode baixar.',
  },
  {
    n: '03',
    icon: BookOpen,
    title: 'Devolve às Coordenações.',
    copy: 'A leitura da trajetória vira insumo para reforma curricular. As Coordenações recebem o recorte do próprio curso, com comparativos por grande área.',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Faz ponte entre turmas.',
    copy: 'Mentoria, mural de vagas indicadas por egressos, reencontros anuais. A camada humana — sempre opcional, sempre com consentimento explícito.',
  },
]

export function SobreAtuacao() {
  return (
    <PortalSection id="atuacao">
      <SectionHeader
        eyebrow="§ 02 · O que fazemos"
        aside="Tudo o que está fora dessa lista, o SAE não faz — por escolha, não por falta."
      >
        Quatro coisas.{' '}
        <span className="font-normal italic text-primary">Sem mais, sem menos.</span>
      </SectionHeader>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
        {items.map(({ n, icon: Icon, title, copy }) => (
          <article key={n} className="bg-card p-8">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-medium leading-none text-primary tabular-nums">
                {n}
              </span>
              <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </div>
            </div>
            <h3 className="mt-6 text-balance font-serif text-2xl font-medium leading-tight tracking-tight">
              {title}
            </h3>
            <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </PortalSection>
  )
}
