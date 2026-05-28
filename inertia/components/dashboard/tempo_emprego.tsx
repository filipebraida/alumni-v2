import { Clock } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import type { TempoEmprego } from '~/components/dashboard/types'

/**
 * "Tempo até o 1º emprego": distribuição da turma em barras horizontais, com
 * um lembrete de que o egresso ainda não informou o próprio dado.
 */
export function DashboardTempoEmprego({ tempo }: { tempo: TempoEmprego }) {
  const max = Math.max(...tempo.distribuicao.map((d) => d.pct))

  return (
    <Card className="shadow-sm">
      <DashboardSectionHeader
        icon={Clock}
        title="Tempo até o 1º emprego"
        description={
          <>
            Mediana da turma:{' '}
            <span className="font-medium text-foreground tabular-nums">{tempo.mediana}</span>
          </>
        }
      />

      <div className="space-y-2.5 px-5 pb-5">
        {tempo.distribuicao.map((faixa) => (
          <div key={faixa.rotulo} className="grid grid-cols-12 items-center gap-2 text-xs">
            <span className="col-span-4 text-muted-foreground">{faixa.rotulo}</span>
            <div className="col-span-7 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary/80"
                style={{ width: `${(faixa.pct / max) * 100}%` }}
              />
            </div>
            <span className="col-span-1 text-right font-medium tabular-nums">{faixa.pct}%</span>
          </div>
        ))}
        <p className="pt-1 text-muted-foreground text-xs italic">
          Você ainda não informou —{' '}
          <button type="button" className="text-primary underline-offset-2 hover:underline">
            preencher agora
          </button>
        </p>
      </div>
    </Card>
  )
}
