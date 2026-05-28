import { cn } from '~/lib/utils'
import type { FaixaSalarial } from '~/components/dashboard/types'

/**
 * Histograma das faixas salariais da turma. A faixa do próprio egresso é
 * destacada (cor cheia + rótulo flutuante); as demais ficam esmaecidas.
 */
export function SalaryBars({ faixas }: { faixas: FaixaSalarial[] }) {
  const max = Math.max(...faixas.map((f) => f.pct))

  return (
    <div className="flex h-32 items-end gap-2">
      {faixas.map((faixa) => (
        <div key={faixa.rotulo} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-24 w-full items-end">
            <div
              className={cn(
                'w-full rounded-t transition-all',
                faixa.destaque ? 'bg-primary' : 'bg-primary/25'
              )}
              style={{ height: `${(faixa.pct / max) * 100}%` }}
            />
            {faixa.destaque && (
              <span className="-top-5 -translate-x-1/2 absolute left-1/2 rounded bg-primary px-1.5 py-0.5 font-medium text-primary-foreground text-xs">
                {faixa.pct}%
              </span>
            )}
          </div>
          <div className="text-center">
            <div
              className={cn(
                'text-xs',
                faixa.destaque ? 'font-medium text-foreground' : 'text-muted-foreground'
              )}
            >
              {faixa.rotulo}
            </div>
            {!faixa.destaque && (
              <div className="text-muted-foreground/70 text-xs tabular-nums">{faixa.pct}%</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
