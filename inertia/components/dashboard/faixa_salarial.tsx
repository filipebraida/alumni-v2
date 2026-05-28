import { LineChart } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { SoftBadge } from '~/components/portal/soft_badge'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import { SalaryBars } from '~/components/dashboard/salary_bars'
import type { Carreira } from '~/components/dashboard/types'

/**
 * "Faixa salarial · sua turma": histograma agregado e anonimizado, com a faixa
 * do egresso destacada e legenda.
 */
export function DashboardFaixaSalarial({ carreira }: { carreira: Carreira }) {
  return (
    <Card className="shadow-sm">
      <DashboardSectionHeader
        icon={LineChart}
        title="Faixa salarial · sua turma"
        description={
          <>
            Mediana:{' '}
            <span className="font-medium text-foreground tabular-nums">
              {carreira.medianaSalarial}
            </span>{' '}
            · agregado e anonimizado
          </>
        }
        action={<SoftBadge>Você confirmou os dados</SoftBadge>}
      />

      <div className="px-5 pb-5">
        <SalaryBars faixas={carreira.faixas} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-muted-foreground text-xs">
          <span>
            Sua faixa: <span className="font-medium text-foreground">{carreira.suaFaixa}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-primary" /> Você
            <span className="ml-2 size-2 rounded-sm bg-primary/25" /> Demais egressos
          </span>
        </div>
      </div>
    </Card>
  )
}
