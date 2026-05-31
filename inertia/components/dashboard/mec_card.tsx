import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Edit3,
  Flag,
  GraduationCap,
  LineChart,
  MapPin,
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
  award: Award,
  book: BookOpen,
  calendar: Calendar,
}

/**
 * Card de um campo MEC com 3 estados de confiança: `confirmado` (azul,
 * verde-claro), `desatualizado` (amarelo, precisa revisar) e `ausente` (cinza,
 * sem valor — convite a preencher). Edição vai pelo fluxo de atualização.
 */
export function MecCard({ campo }: { campo: CampoMec }) {
  const Icone = ICONES[campo.icone] ?? Check
  const ausente = campo.confianca === 'ausente'
  const precisaRevisar = campo.confianca === 'desatualizado'

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
          <div className="text-muted-foreground text-xs uppercase tracking-wider">
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
        {precisaRevisar && (
          <span
            className="mt-1.5 inline-block size-1.5 rounded-full bg-warning"
            title="precisa confirmar"
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-xs">
          {campo.confianca === 'confirmado' && <>confirmado há {campo.atualizadoEm}</>}
          {precisaRevisar && (
            <span className="text-warning-foreground">
              desatualizado há {campo.atualizadoEm}
            </span>
          )}
          {ausente && <>não informado</>}
        </span>
        {ausente ? (
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            <Plus /> Adicionar
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2 text-xs',
              precisaRevisar
                ? 'text-foreground'
                : 'opacity-0 transition-opacity group-hover:opacity-100'
            )}
          >
            <Edit3 /> Editar
          </Button>
        )}
      </div>
    </div>
  )
}
