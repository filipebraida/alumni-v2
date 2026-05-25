import { Check } from 'lucide-react'
import { cn } from '~/lib/utils'

const cols = ['Público', 'Egresso', 'Coord.', 'Chefia', 'PROGRAD']

// 0 = sem acesso, 1 = pleno, 2 = parcial / sob registro
const rows: { label: string; sub: string; vals: number[] }[] = [
  { label: 'Relatório anual', sub: 'PDF agregado por curso', vals: [1, 1, 1, 1, 1] },
  { label: 'Microdados anonimizados', sub: 'CSV, k ≥ 5', vals: [1, 1, 1, 1, 1] },
  { label: 'Painel da Coordenação', sub: 'Dashboard agregado', vals: [0, 0, 1, 1, 1] },
  { label: 'Dados do próprio cadastro', sub: 'Linha individual', vals: [0, 1, 0, 0, 0] },
  {
    label: 'Microdados identificáveis',
    sub: 'Linha individual de terceiros',
    vals: [0, 0, 0, 0, 0],
  },
  { label: 'Auditoria de acesso', sub: 'Quem leu o quê', vals: [0, 0, 0, 0, 2] },
]

function Cell({ v }: { v: number }) {
  if (v === 1) {
    return (
      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
    )
  }
  if (v === 2) {
    return (
      <span className="grid size-6 place-items-center rounded-full bg-brand-yellow/20 text-warning-foreground">
        <span className="text-[10px] font-semibold">P</span>
      </span>
    )
  }
  return <span className="font-mono text-[14px] text-muted-foreground/40">—</span>
}

export function AcessoMatriz() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 03 · Acesso
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Quem vê o quê,{' '}
              <span className="font-normal text-foreground/85 italic">linha por linha.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-5 md:text-right">
            Microdados identificáveis nunca saem do banco —
            <br className="hidden md:block" />
            nem pra Reitoria, nem pro MEC.
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Camada de dado
                  </th>
                  {cols.map((c) => (
                    <th
                      key={c}
                      className="px-3 py-4 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className={cn(i > 0 && 'border-t')}>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-semibold tracking-tight">{r.label}</div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground">{r.sub}</div>
                    </td>
                    {r.vals.map((v, j) => (
                      <td key={cols[j]} className="px-3 py-4">
                        <div className="flex justify-center">
                          <Cell v={v} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t bg-muted/20 px-6 py-3 text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="size-2.5" strokeWidth={2.5} />
              </span>
              Acesso pleno
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-brand-yellow/20 text-warning-foreground">
                <span className="text-[8px] font-semibold">P</span>
              </span>
              Parcial · sob registro de auditoria
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="font-mono">—</span>
              Sem acesso
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
