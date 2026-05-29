import { CircleCheck, Clock, Inbox, Users, type LucideIcon } from 'lucide-react'

import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { EgressosEstatisticas } from '~/components/gestao/types'

type Tone = 'primary' | 'success' | 'warning' | 'muted'

const TONE_ICON: Record<Tone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  muted: 'text-muted-foreground',
}

function StatCard({
  icon: Icon,
  rotulo,
  valor,
  sub,
  tone = 'primary',
}: {
  icon: LucideIcon
  rotulo: string
  valor: number | string
  sub?: string
  tone?: Tone
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          {rotulo}
        </span>
        <Icon className={cn('size-4 shrink-0', TONE_ICON[tone])} />
      </div>
      <div className="mt-3 font-semibold text-3xl leading-none tabular-nums tracking-tight">
        {valor}
      </div>
      {sub && <div className="mt-2 text-muted-foreground text-xs">{sub}</div>}
    </Card>
  )
}

/** Os 4 cards de frescor do curso, no topo da tela de egressos (responsivo 2→4). */
export function EgressosStats({ estatisticas }: { estatisticas: EgressosEstatisticas }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={Users} rotulo="Total de egressos" valor={estatisticas.total} tone="primary" />
      <StatCard
        icon={CircleCheck}
        rotulo="Questionário em dia"
        valor={estatisticas.emDia}
        sub={`${estatisticas.pctEmDia}% do curso atualizado`}
        tone="success"
      />
      <StatCard
        icon={Clock}
        rotulo="Desatualizados"
        valor={estatisticas.desatualizado}
        sub={`> ${estatisticas.janelaFrescorMeses} meses sem atualizar`}
        tone="warning"
      />
      <StatCard
        icon={Inbox}
        rotulo="Sem registro"
        valor={estatisticas.semRegistro}
        sub="nunca responderam"
        tone="muted"
      />
    </div>
  )
}
