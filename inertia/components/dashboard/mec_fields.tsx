import { ListChecks } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { SoftBadge } from '~/components/portal/soft_badge'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import { MecCard } from '~/components/dashboard/mec_card'
import type { CampoMec } from '~/components/dashboard/types'

/**
 * Vitrine dos 8 dados que a UFRRJ acompanha para o MEC — somente leitura. A
 * atualização acontece no fluxo dedicado (CTA no hero e no card de Frescor).
 */
export function DashboardMecFields({ campos, faltando }: { campos: CampoMec[]; faltando: number }) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <DashboardSectionHeader
        icon={ListChecks}
        title="Os 8 dados que a UFRRJ acompanha"
        description="É o que a Universidade envia ao MEC. Atualize quando algo mudar."
        action={
          faltando > 0 ? <SoftBadge tone="yellow">{faltando} a preencher</SoftBadge> : undefined
        }
      />

      <Separator />

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {campos.map((campo) => (
          <MecCard key={campo.chave} campo={campo} />
        ))}
      </div>
    </Card>
  )
}
