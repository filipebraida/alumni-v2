import {
  Briefcase,
  Check,
  Clock,
  Flag,
  GraduationCap,
  LineChart,
  MapPin,
  Pencil,
  Plus,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
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
 * Card de um dos 8 campos MEC. O estado (`confianca`) define o tom do ícone, o
 * texto de status e a ação: confirmar, revalidar ("Sim, ainda" / "Mudou") ou
 * adicionar quando ausente.
 */
export function MecCard({ campo }: { campo: CampoMec }) {
  const Icone = ICONES[campo.icone] ?? Check
  const ausente = campo.confianca === 'ausente'
  const revisar = campo.confianca === 'revisar'

  return (
    <div className="group bg-card p-4 transition-colors hover:bg-muted/30">
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
            {campo.valor}
          </div>
        </div>
        {revisar && (
          <span
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning"
            title="precisa confirmar"
          />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">
          {campo.confianca === 'confirmado' && <>atualizado há {campo.atualizado}</>}
          {revisar && (
            <span className="text-warning-foreground">há {campo.atualizado}, confirme</span>
          )}
          {ausente && 'não informado'}
        </span>
        {ausente ? (
          <Button size="sm" variant="outline">
            <Plus /> Adicionar
          </Button>
        ) : revisar ? (
          <div className="flex items-center gap-1">
            <Button size="sm">Sim, ainda</Button>
            <Button size="sm" variant="ghost">
              Mudou
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Pencil /> Editar
          </Button>
        )}
      </div>
    </div>
  )
}
