'use client'

import { Briefcase, Check, Flag, LucideIcon, User, Users } from 'lucide-react'
import { useState } from 'react'
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
      <dt className="w-32 shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground">
        {term}
      </dt>
      <dd className="text-[14px] leading-relaxed text-foreground">{def}</dd>
    </div>
  )
}

export function PapeisInstitucionais() {
  const [active, setActive] = useState('coord')
  const cur = roles.find((r) => r.id === active) ?? roles[0]

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 02 · Por papel
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Cada cadeira vê{' '}
              <span className="font-normal text-foreground/85 italic">o que precisa ver.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
            Quatro perfis institucionais, com escopos diferentes — mas a mesma base de dados.
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b">
          {roles.map((r) => {
            const on = r.id === active
            const Icon = r.icon
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r.id)}
                className={cn(
                  'relative inline-flex items-center gap-2 px-5 py-3.5 text-[14px] font-medium transition-colors',
                  on ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={on}
              >
                <Icon className={cn('size-4', on ? 'text-primary' : 'text-muted-foreground/70')} />
                {r.label}
                {on && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-t-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>

        <div key={cur.id} className="mt-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-5">
            <h3 className="text-balance font-serif font-medium text-[28px] leading-[1.15] tracking-[-0.01em]">
              {cur.tagline}
            </h3>
            <dl className="mt-7 space-y-4">
              <RoleMeta term="Pra que serve" def={cur.usedFor} />
              <RoleMeta term="Como entra" def={cur.acesso} />
              <RoleMeta term="Frequência" def={cur.freq} last />
            </dl>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="rounded-2xl border bg-card p-7">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                O que aparece no painel
              </div>
              <ul className="mt-4 grid gap-3">
                {cur.sees.map((line) => (
                  <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed">
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
      </div>
    </section>
  )
}
