import { ArrowRight, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { SoftBadge } from '~/components/portal/soft_badge'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import type { Experiencia } from '~/components/dashboard/types'

/**
 * "Sua trajetória": mini-linha do tempo das experiências, com a atual marcada.
 */
export function DashboardTrajetoria({ experiencias }: { experiencias: Experiencia[] }) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <DashboardSectionHeader
        align="center"
        className="pb-5"
        title="Sua trajetória"
        description={`${experiencias.length} etapas · última atualizada há 2 meses`}
        action={
          <>
            <Button variant="outline" size="sm">
              <Plus /> Adicionar
            </Button>
            <Button variant="ghost" size="sm">
              Ver completa <ArrowRight />
            </Button>
          </>
        }
      />

      <Separator />

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {experiencias.map((exp, i) => (
          <div key={exp.id} className="bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md bg-muted font-semibold text-xs">
                {exp.sigla}
              </div>
              {i === 0 && <SoftBadge>Atual</SoftBadge>}
            </div>
            <div className="mt-3 font-semibold text-sm">{exp.cargo}</div>
            <div className="text-muted-foreground text-sm">{exp.org}</div>
            <div className="mt-1 text-muted-foreground text-xs">
              {exp.inicio} — {exp.fim}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
