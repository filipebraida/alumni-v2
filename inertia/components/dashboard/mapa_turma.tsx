import { Globe } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { BrasilMap } from '~/components/dashboard/brasil_map'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import type { MapaTurma } from '~/components/dashboard/types'

const TOP = 5

/**
 * "Onde sua turma está": mapa do Brasil com bolhas por estado + ranking dos
 * principais estados com barras proporcionais. Recebe um label de contexto
 * (ex. "Ciência da Computação · Turma 2022") já formatado pelo chamador.
 */
export function DashboardMapaTurma({
  mapa,
  contexto,
}: {
  mapa: MapaTurma
  contexto: string
}) {
  const top = mapa.estados.slice(0, TOP)
  const restantes = Math.max(mapa.estados.length - TOP, 0)

  return (
    <Card className="overflow-hidden shadow-sm">
      <DashboardSectionHeader
        icon={Globe}
        title="Onde sua turma está"
        description={`${contexto} — ${mapa.mapeados} de ${mapa.turmaTotal} mapeados`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="px-5 pb-5 lg:col-span-7">
          <BrasilMap estados={mapa.estados} />
        </div>
        <div className="space-y-2 border-t p-5 lg:col-span-5 lg:border-t-0 lg:border-l">
          <SectionEyebrow>Top {TOP} estados</SectionEyebrow>
          {top.map((estado) => {
            const pct = Math.round((estado.total / mapa.mapeados) * 100)
            return (
              <div key={estado.uf} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">
                    {estado.uf} ·{' '}
                    <span className="font-normal text-muted-foreground">{estado.nome}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {estado.total} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
          {restantes > 0 && (
            <div className="pt-2 text-muted-foreground text-xs">+ {restantes} outros locais</div>
          )}
        </div>
      </div>
    </Card>
  )
}
