import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Flag,
  GraduationCap,
  LineChart,
  MapPin,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { type Data } from '@generated/data'
import { cn } from '~/lib/utils'

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

export function MecCard({ campo }: { campo: Data.CampoMec }) {
  const Icone = ICONES[campo.icone] ?? Check
  const ausente = campo.confianca === 'ausente'
  const precisaRevisar = campo.confianca === 'desatualizado'

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
      <div className="mt-3 text-muted-foreground text-xs">
        {campo.confianca === 'confirmado' && <>confirmado há {campo.atualizadoEm}</>}
        {precisaRevisar && (
          <span className="text-warning-foreground">desatualizado há {campo.atualizadoEm}</span>
        )}
        {ausente && <>não informado</>}
      </div>
    </div>
  )
}
