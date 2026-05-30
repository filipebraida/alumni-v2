import { type LucideIcon } from 'lucide-react'

import { cn } from '~/lib/utils'

type GlifoBaseProps = {
  /** Filled → success (verde), vazio → muted (cinza). */
  conectado: boolean
  className?: string
}

const glifoCls = (conectado: boolean) =>
  cn(
    'grid size-9 shrink-0 place-items-center rounded-md transition-colors',
    conectado ? 'bg-success/10 text-success-foreground' : 'bg-muted text-muted-foreground'
  )

/** Glifo texto-only (ex: ORCID iD). */
export function GlifoTexto({ texto, conectado, className }: GlifoBaseProps & { texto: string }) {
  return <span className={cn(glifoCls(conectado), 'font-bold text-sm', className)}>{texto}</span>
}

/** Glifo com ícone (lucide). */
export function GlifoIcone({
  icon: Icon,
  conectado,
  className,
}: GlifoBaseProps & { icon: LucideIcon }) {
  return (
    <span className={cn(glifoCls(conectado), className)}>
      <Icon className="size-4" />
    </span>
  )
}
