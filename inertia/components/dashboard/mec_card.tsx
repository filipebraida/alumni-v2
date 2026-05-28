import {
  Briefcase,
  Check,
  Clock,
  Flag,
  GraduationCap,
  LineChart,
  MapPin,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { CampoMec } from '~/components/dashboard/types'

const ICONES: Record<string, LucideIcon> = {
  pin: MapPin,
  briefcase: Briefcase,
  star: Star,
  flag: Flag,
  chart: LineChart,
  check: Check,
  cap: GraduationCap,
  clock: Clock,
}

/**
 * Card somente-leitura de um dos 8 campos MEC: ícone, rótulo e o valor atual da
 * última foto (`resposta`). Campo sem valor aparece como "não informado". A
 * edição não acontece aqui — vai pelo fluxo de atualização.
 */
export function MecCard({ campo }: { campo: CampoMec }) {
  const Icone = ICONES[campo.icone] ?? Check
  const ausente = campo.valor === null

  return (
    <div className="bg-card p-4">
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-md',
            ausente ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
          )}
        >
          <Icone className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-muted-foreground text-xs uppercase tracking-wide">
            {campo.rotulo}
          </div>
          <div
            className={cn(
              'mt-0.5 truncate font-semibold text-sm',
              ausente && 'font-normal text-muted-foreground italic'
            )}
          >
            {campo.valor ?? '— não informado'}
          </div>
        </div>
      </div>
    </div>
  )
}
