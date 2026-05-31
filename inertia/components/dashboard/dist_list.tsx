import { cn } from '~/lib/utils'
import type { FaixaPct } from '~/components/dashboard/types'

/**
 * Lista distributiva: rótulo · barra horizontal · % alinhado à direita. Modo
 * `compact` reduz o espaçamento entre linhas (usado no painel lateral).
 */
export function DistList({ items, compact }: { items: FaixaPct[]; compact?: boolean }) {
  return (
    <div className={cn(compact ? 'space-y-2' : 'space-y-2.5')}>
      {items.map((item) => (
        <div key={item.rotulo} className="grid grid-cols-12 items-center gap-2 text-xs">
          <span
            className={cn(
              'col-span-4 truncate',
              item.destaque ? 'font-medium text-foreground' : 'text-muted-foreground'
            )}
          >
            {item.rotulo}
          </span>
          <div className="col-span-7 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full', item.destaque ? 'bg-primary' : 'bg-primary/40')}
              style={{ width: `${item.pct}%` }}
            />
          </div>
          <span className="col-span-1 text-right font-medium tabular-nums">{item.pct}%</span>
        </div>
      ))}
    </div>
  )
}
