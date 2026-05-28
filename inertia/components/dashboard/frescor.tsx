import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '~/components/ui/progress'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import type { Frescor } from '~/components/dashboard/types'

/**
 * "Frescor" (caducidade): score de atualização dos dados, prazo de expiração e
 * quantos dos campos MEC já foram confirmados.
 */
export function DashboardFrescor({
  frescor,
  confirmados,
  total,
}: {
  frescor: Frescor
  confirmados: number
  total: number
}) {
  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <SectionEyebrow>Frescor</SectionEyebrow>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-semibold text-2xl tabular-nums tracking-tight">
              {frescor.geral}%
            </span>
            <span className="text-muted-foreground text-xs">atual</span>
          </div>
        </div>
        <Badge variant="warning" className="gap-1.5 self-start">
          <span className="size-1.5 rounded-full bg-warning" />
          Expira em {frescor.expiraEm}
        </Badge>
      </div>

      <Progress value={frescor.geral} className="mt-3">
        <ProgressTrack>
          <ProgressIndicator className="bg-warning" />
        </ProgressTrack>
      </Progress>

      <div className="mt-3 flex items-center justify-between text-muted-foreground text-xs">
        <span>
          <span className="font-medium text-foreground tabular-nums">{confirmados}</span> de{' '}
          <span className="tabular-nums">{total}</span> campos confirmados
        </span>
        <span>Última revisão {frescor.ultimaRevisao}</span>
      </div>
    </Card>
  )
}
