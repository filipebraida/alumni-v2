import { ArrowUpRight } from 'lucide-react'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'

function DPKpi({ label, value, up = false }: { label: string; value: string; up?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-serif text-2xl font-medium leading-none text-foreground tabular-nums">
          {value}
        </span>
        {up && <span className="text-xs font-medium text-success">↑</span>}
      </div>
    </div>
  )
}

function DPBar({ label, pct, muted = false }: { label: string; pct: number; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-7 shrink-0 font-medium text-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full', muted ? 'bg-muted-foreground/40' : 'bg-primary')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-muted-foreground tabular-nums">{pct}%</span>
    </div>
  )
}

/** Editorial mock of the Coordenação dashboard. */
export function UfrrjPainel() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border bg-muted/30"
      />

      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Painel da Coordenação
          </div>
          <SoftBadge>
            <span className="inline-block size-1.5 rounded-full bg-success" />
            Ao vivo
          </SoftBadge>
        </div>

        <div className="p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Agronomia · Seropédica
          </div>
          <h3 className="mt-1 font-serif text-xl font-medium leading-tight tracking-tight">
            Coorte 2018–2024 · panorama
          </h3>

          <div className="mt-5 grid grid-cols-3 gap-4 border-y py-4">
            <DPKpi label="Resposta" value="73%" up />
            <DPKpi label="Empregados" value="84%" up />
            <DPKpi label="Pós-grad" value="31%" />
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Onde estão · top 5 estados
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">n=384</div>
            </div>
            <div className="mt-3 space-y-2.5">
              <DPBar label="RJ" pct={62} />
              <DPBar label="SP" pct={18} />
              <DPBar label="MG" pct={9} />
              <DPBar label="ES" pct={6} />
              <DPBar label="Outros" pct={5} muted />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-xs text-muted-foreground">
              Atualizado em <span className="text-foreground">12/mai</span>
            </div>
            <a href="#" className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              Abrir relatório <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
