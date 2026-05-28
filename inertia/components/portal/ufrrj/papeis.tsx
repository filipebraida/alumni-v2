import { Briefcase, Check, Flag, LucideIcon, User, Users } from 'lucide-react'
import { useState } from 'react'
import { PortalSection } from '~/components/portal/section'
import { SectionHeader } from '~/components/portal/section_header'
import { Tabs, TabsList, TabsPanel, TabsTab } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'

type Role = {
  id: string
  label: string
  icon: LucideIcon
  tagline: string
  sees: string[]
  usedFor: string
  acesso: string
  freq: string
}

const roles: Role[] = [
  {
    id: 'coord',
    label: 'Coordenador de Curso',
    icon: User,
    tagline: 'O painel é seu ponto de partida.',
    sees: [
      'Dashboard do curso com recortes por coorte, gênero e região',
      'Comparativo com cursos da mesma grande área',
      'Indicadores prontos para o relato anual ao NDE',
      'Alertas mensais quando a taxa de resposta da coorte muda',
    ],
    usedFor: 'Revisão do PPC, autoavaliação CPA, renovação de reconhecimento.',
    acesso: 'SSO via SIGAA',
    freq: 'Contínuo',
  },
  {
    id: 'chefia',
    label: 'Chefia de Departamento',
    icon: Briefcase,
    tagline: 'Visão consolidada de todos os cursos do departamento.',
    sees: [
      'Empregabilidade média dos cursos sob a chefia',
      'Distribuição da pós-graduação por linha de pesquisa',
      'Mobilidade docente dos egressos (quem virou colega)',
      'Sinalização de cursos com queda de indicadores',
    ],
    usedFor: 'Alocação de TIDE, planejamento de concursos, distribuição de carga.',
    acesso: 'SSO via SIGAA',
    freq: 'Trimestral',
  },
  {
    id: 'prograd',
    label: 'PROGRAD',
    icon: Flag,
    tagline: 'A visão completa, com microdados.',
    sees: [
      'Todos os cursos da UFRRJ, com cruzamentos transversais',
      'Microdados anonimizados em CSV para análises externas',
      'Comparativo com IES federais parceiras (3 instituições)',
      'Painel executivo para apresentação ao Conselho',
    ],
    usedFor: 'Política de graduação, expansão/criação de vagas, prestação de contas.',
    acesso: 'Perfil dedicado',
    freq: 'Contínuo',
  },
  {
    id: 'nde',
    label: 'NDE',
    icon: Users,
    tagline: 'Recortes longitudinais por coorte.',
    sees: [
      'Trajetória profissional por ano de ingresso (não só de saída)',
      'Aderência do egresso ao perfil declarado no PPC',
      'Trabalhos de conclusão por área de inserção real',
      'Citações dos egressos sobre lacunas curriculares',
    ],
    usedFor: 'Reformas curriculares — fundamenta o que mudar e o que manter.',
    acesso: 'Acesso temporário durante o ciclo',
    freq: 'Anual',
  },
]

function RoleMeta({ term, def, last = false }: { term: string; def: string; last?: boolean }) {
  return (
    <div className={cn('flex items-baseline gap-4', !last && 'border-b pb-4')}>
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {term}
      </dt>
      <dd className="text-sm leading-relaxed text-foreground">{def}</dd>
    </div>
  )
}

export function UfrrjPapeis() {
  const [active, setActive] = useState('coord')

  return (
    <PortalSection>
      <SectionHeader
        eyebrow="§ 02 · Por papel"
        aside="Quatro perfis institucionais, com escopos diferentes — mas a mesma base de dados."
      >
        Cada cadeira vê{' '}
        <span className="font-normal italic text-foreground/85">o que precisa ver.</span>
      </SectionHeader>

      <Tabs value={active} onValueChange={(value) => setActive(value as string)} className="mt-10">
        <TabsList variant="underline" className="w-full flex-wrap justify-start border-b">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <TabsTab
                key={r.id}
                value={r.id}
                className="px-5 [&_svg]:text-muted-foreground/70 data-active:[&_svg]:text-primary"
              >
                <Icon />
                {r.label}
              </TabsTab>
            )
          })}
        </TabsList>

        {roles.map((r) => (
          <TabsPanel key={r.id} value={r.id} className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-5">
                <h3 className="text-balance font-serif text-3xl font-medium leading-tight tracking-tight">
                  {r.tagline}
                </h3>
                <dl className="mt-7 space-y-4">
                  <RoleMeta term="Pra que serve" def={r.usedFor} />
                  <RoleMeta term="Como entra" def={r.acesso} />
                  <RoleMeta term="Frequência" def={r.freq} last />
                </dl>
              </div>

              <div className="md:col-span-7">
                <div className="rounded-2xl border bg-card p-7">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    O que aparece no painel
                  </div>
                  <ul className="mt-4 grid gap-3">
                    {r.sees.map((line) => (
                      <li key={line} className="flex items-start gap-3 text-sm leading-relaxed">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        <span className="text-pretty text-foreground">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsPanel>
        ))}
      </Tabs>
    </PortalSection>
  )
}
