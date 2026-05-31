import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '~/components/ui/progress'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { cn } from '~/lib/utils'
import type { Frescor } from '~/components/dashboard/types'

export function DashboardFrescor({
  frescor,
  modo,
}: {
  frescor: Frescor
  modo: 'manutencao' | 'primeira'
}) {
  const alerta = frescor.geral < 60
  const primeira = modo === 'primeira'

  return (
    <Card className="flex flex-col p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SectionEyebrow>Frescor geral</SectionEyebrow>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-semibold text-2xl tabular-nums tracking-tight">
              {frescor.geral}%
            </span>
            <span className="text-muted-foreground text-xs">
              {primeira ? '· sem resposta ainda' : 'média das formações'}
            </span>
          </div>
        </div>
        {!primeira && (
          <Badge variant="warning" className="shrink-0 gap-1.5 self-start">
            <span className="size-1.5 rounded-full bg-warning" />
            Expira em {frescor.expiraEm}
          </Badge>
        )}
      </div>

      <Progress value={frescor.geral} className="mt-auto pt-4">
        <ProgressTrack>
          <ProgressIndicator className={cn(alerta ? 'bg-warning' : 'bg-primary')} />
        </ProgressTrack>
      </Progress>

      <div className="mt-3 text-muted-foreground text-xs">
        {primeira ? (
          <span>Primeira revisão dá origem à sua linha de base.</span>
        ) : (
          <span>Revisão há {frescor.ultimaRevisao}</span>
        )}
      </div>
    </Card>
  )
}
