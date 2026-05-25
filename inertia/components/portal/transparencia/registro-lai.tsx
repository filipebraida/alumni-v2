import { ArrowRight } from 'lucide-react'
import { cn } from '~/lib/utils'

type Status = 'atendido' | 'parcial' | 'indeferido'

const log: {
  date: string
  ref: string
  pedido: string
  status: Status
  tempo: string
  motivo?: string
}[] = [
  {
    date: '12/nov/2025',
    ref: 'LAI-2025-#0142',
    pedido: 'Microdados de empregabilidade — Agronomia 2018–2023',
    status: 'atendido',
    tempo: '4 dias',
  },
  {
    date: '30/set/2025',
    ref: 'LAI-2025-#0129',
    pedido: 'Lista nominal de egressos da Med. Veterinária',
    status: 'indeferido',
    tempo: '6 dias',
    motivo: 'Vedação LGPD art. 7º',
  },
  {
    date: '04/ago/2025',
    ref: 'LAI-2025-#0098',
    pedido: 'Empregabilidade — Engenharia Florestal Nova Iguaçu',
    status: 'atendido',
    tempo: '2 dias',
  },
  {
    date: '18/jun/2025',
    ref: 'LAI-2025-#0071',
    pedido: 'Metodologia de cálculo da taxa de resposta',
    status: 'atendido',
    tempo: '1 dia',
  },
  {
    date: '11/mai/2025',
    ref: 'LAI-2025-#0058',
    pedido: 'Salário mediano por raça/cor — todos os cursos',
    status: 'parcial',
    tempo: '12 dias',
    motivo: 'Suprimidos recortes com n < 5',
  },
  {
    date: '02/abr/2025',
    ref: 'LAI-2025-#0033',
    pedido: 'Histórico de mudanças no questionário',
    status: 'atendido',
    tempo: '3 dias',
  },
]

const statusStyle: Record<Status, string> = {
  atendido: 'bg-primary/10 text-primary',
  parcial: 'bg-brand-yellow/20 text-warning-foreground',
  indeferido: 'bg-destructive/10 text-destructive',
}

function LaiStat({ n, label, tone }: { n: string; label: string; tone?: 'success' }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div
        className={cn(
          'font-serif font-medium text-[30px] leading-none tracking-[-0.01em] tabular-nums',
          tone === 'success' ? 'text-success' : 'text-foreground'
        )}
      >
        {n}
      </div>
      <div className="mt-2 text-[12px] leading-snug text-muted-foreground">{label}</div>
    </div>
  )
}

export function RegistroLAI() {
  return (
    <section id="lai" className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 04 · Lei de Acesso à Informação
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Cada pedido,{' '}
              <span className="font-normal text-foreground/85 italic">no registro.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-5 md:text-right">
            Pedidos LAI são anonimizados e publicados aqui em até 30 dias depois da resposta.
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          <LaiStat n="12" label="Pedidos no ciclo" />
          <LaiStat n="91%" label="Taxa de atendimento" tone="success" />
          <LaiStat n="4,5 dias" label="Tempo mediano de resposta" />
          <LaiStat n="0" label="Pedidos vencidos sem resposta" />
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-muted/40">
                <tr className="border-b">
                  <th className="px-6 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Data
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Protocolo
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Pedido (resumo)
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Tempo
                  </th>
                </tr>
              </thead>
              <tbody>
                {log.map((l, i) => (
                  <tr key={l.ref} className={cn(i > 0 && 'border-t')}>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-[12px] text-muted-foreground">
                      {l.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-[12px] text-foreground">
                      {l.ref}
                    </td>
                    <td className="px-6 py-4 text-[14px] leading-snug">
                      <div className="text-pretty text-foreground">{l.pedido}</div>
                      {l.motivo && (
                        <div className="mt-1 text-[11.5px] text-muted-foreground">{l.motivo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider',
                          statusStyle[l.status]
                        )}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-mono text-[12px] text-muted-foreground tabular-nums">
                      {l.tempo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t bg-muted/20 px-6 py-3 text-[12px]">
            <span className="text-muted-foreground">Mostrando 6 de 12 pedidos do ciclo</span>
            <a
              href="#"
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
            >
              Ver registro completo <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
