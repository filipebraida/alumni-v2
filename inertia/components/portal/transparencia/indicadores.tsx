import { SoftBadge } from '~/components/portal/soft_badge'
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

export function TransparenciaIndicadores() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Ao vivo</div>
        <SoftBadge>
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-success" />
          Atualizado agora
        </SoftBadge>
      </div>

      <ul className="mt-4 divide-y">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-baseline justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
          >
            <div>
              <div className="text-xs text-muted-foreground">{it.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground/80">{it.sub}</div>
            </div>
            <div
              className={cn(
                'font-serif text-2xl font-medium leading-none tracking-tight tabular-nums',
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
