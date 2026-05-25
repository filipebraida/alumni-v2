import { SoftBadge } from '~/components/portal/soft-badge'
import { cn } from '~/lib/utils'

const items: { label: string; value: string; sub: string; tone?: 'primary' | 'success' }[] = [
  {
    label: 'Egressos cadastrados',
    value: '4.802',
    sub: '+218 vs. ciclo anterior',
    tone: 'primary',
  },
  { label: 'Taxa de resposta', value: '38%', sub: 'meta 2026: 45%', tone: 'success' },
  { label: 'Cursos com n ≥ 5', value: '47 / 47', sub: 'cobertura plena' },
  { label: 'Pedidos LAI no ano', value: '12', sub: '11 atendidos · 1 indeferido' },
]

export function IndicadoresAoVivo() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Ao vivo</div>
        <SoftBadge>
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
          Atualizado agora
        </SoftBadge>
      </div>

      <ul className="mt-4 divide-y">
        {items.map((it) => (
          <li
            key={it.label}
            className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-3.5 first:pt-1 last:pb-1"
          >
            <div>
              <div className="text-[12px] text-muted-foreground">{it.label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground/80">{it.sub}</div>
            </div>
            <div
              className={cn(
                'font-serif font-medium text-[26px] leading-none tracking-[-0.01em] tabular-nums',
                it.tone === 'primary'
                  ? 'text-primary'
                  : it.tone === 'success'
                    ? 'text-success'
                    : 'text-foreground'
              )}
            >
              {it.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
