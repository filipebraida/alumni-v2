import { Badge } from '~/components/ui/badge'
import { Progress, ProgressIndicator, ProgressTrack } from '~/components/ui/progress'
import { cn } from '~/lib/utils'
import type { Formacao } from '~/components/dashboard/types'

export function FormacaoTab({
  formacao,
  selecionada,
  onSelecionar,
}: {
  formacao: Formacao
  selecionada: boolean
  onSelecionar: () => void
}) {
  const concluida = formacao.status === 'concluido'
  const alerta = formacao.frescor < 50

  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionada}
      className={cn(
        'group relative rounded-xl border p-4 text-left transition-all',
        selecionada
          ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="whitespace-nowrap font-semibold text-muted-foreground text-xs uppercase tracking-widest">
          {formacao.nivel}
        </span>
        <Badge variant={concluida ? 'secondary' : 'warning'} className="shrink-0 gap-1">
          <span className={cn('size-1.5 rounded-full', concluida ? 'bg-primary' : 'bg-warning')} />
          {concluida ? 'Concluído' : 'Em curso'}
        </Badge>
      </div>
      <div className="mt-2 font-semibold text-foreground text-sm tracking-tight">
        {formacao.curto}
      </div>
      <div className="mt-0.5 text-muted-foreground text-xs">
        {formacao.campus} · {formacao.rotuloTurma}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Progress value={formacao.frescor} className="h-1.5 flex-1">
          <ProgressTrack className="h-1.5">
            <ProgressIndicator className={cn(alerta ? 'bg-warning' : 'bg-primary')} />
          </ProgressTrack>
        </Progress>
        <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
          {formacao.frescor}%
        </span>
      </div>
      {selecionada && (
        <span className="-bottom-px absolute right-4 left-4 h-0.5 rounded-t-sm bg-primary" />
      )}
    </button>
  )
}
