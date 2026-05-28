import { Link } from '@adonisjs/inertia/react'
import { RefreshCw } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '~/components/ui/progress'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { cn } from '~/lib/utils'
import type { Frescor } from '~/components/dashboard/types'

/**
 * "Frescor" (caducidade): score de atualização da última foto, prazo de
 * expiração e quantos dos 8 campos estão preenchidos. Dono do CTA de
 * atualização — o caminho de escrita sai daqui (e do hero), não dos cards.
 */
export function DashboardFrescor({
  frescor,
  preenchidos,
  total,
}: {
  frescor: Frescor
  preenchidos: number
  total: number
}) {
  return (
    <Card className="flex flex-col p-5 shadow-sm">
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
          <span className="font-medium text-foreground tabular-nums">{preenchidos}</span> de{' '}
          <span className="tabular-nums">{total}</span> campos preenchidos
        </span>
        <span>Última revisão {frescor.ultimaRevisao}</span>
      </div>

      <Link route="respostas.create" className={cn(buttonVariants(), 'mt-4 w-full')}>
        <RefreshCw /> Atualizar meus dados
      </Link>
    </Card>
  )
}
