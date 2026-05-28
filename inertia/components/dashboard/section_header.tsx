import type { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

type Align = 'start' | 'center' | 'end'

const alignClass: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

/**
 * Cabeçalho padrão dos cards do painel: ícone + título (`text-base`), descrição
 * opcional e uma área de ação à direita (badge, botões, chips). Centraliza o
 * layout que se repetia em todas as seções.
 */
export function DashboardSectionHeader({
  icon: Icon,
  title,
  description,
  action,
  align = 'start',
  className,
}: {
  icon?: LucideIcon
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  align?: Align
  className?: string
}) {
  return (
    <div
      className={cn('flex flex-wrap justify-between gap-3 p-5 pb-3', alignClass[align], className)}
    >
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-base tracking-tight">
          {Icon && <Icon className="size-4 text-primary" />}
          {title}
        </h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
