import { BookOpen, LineChart, LucideIcon, Sparkles, Users } from 'lucide-react'

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

export function OQueFazemos() {
  return (
    <section id="o-que-fazemos" className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 02 · O que fazemos
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Quatro coisas.{' '}
              <span className="font-normal text-primary italic">Sem mais, sem menos.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
            Tudo o que está fora dessa lista, o SAE não faz — por escolha, não por falta.
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
          {items.map(({ n, icon: Icon, title, copy }) => (
            <article key={n} className="bg-card p-8">
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-medium text-[28px] leading-none text-primary tabular-nums">
                  {n}
                </span>
                <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </div>
              </div>
              <h3 className="mt-6 text-balance font-serif font-medium text-[22px] leading-[1.18] tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-2.5 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
