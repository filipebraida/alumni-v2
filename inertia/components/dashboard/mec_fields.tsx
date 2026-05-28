import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { SoftBadge } from '~/components/portal/soft_badge'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import { MecCard } from '~/components/dashboard/mec_card'
import type { CampoMec } from '~/components/dashboard/types'

/**
 * "Confirme em 30 segundos": os 8 dados que a UFRRJ envia ao MEC, cada um num
 * card de revalidação rápida. Hairlines entre os cards via `gap-px` + `bg-border`.
 */
export function DashboardMecFields({
  campos,
  pendentes,
}: {
  campos: CampoMec[]
  pendentes: number
}) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <DashboardSectionHeader
        icon={Sparkles}
        align="end"
        title="Confirme em 30 segundos"
        description={
          'Os 8 dados que a UFRRJ envia ao MEC. Toque em "Sim, ainda" para revalidar — ou edite o que mudou.'
        }
        action={
          <>
            <SoftBadge tone="yellow">{pendentes} pendentes</SoftBadge>
            <Button variant="ghost" size="sm">
              Confirmar todos <ArrowRight />
            </Button>
          </>
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
