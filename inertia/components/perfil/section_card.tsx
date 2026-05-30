import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

import { cn } from '~/lib/utils'

type Props = {
  id: string
  icon: LucideIcon
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Wrapper das seções de "Editar perfil": cabeçalho com ícone monocromático,
 * título e descrição opcional; corpo com padding consistente. `id` serve de
 * âncora para o rail lateral (scroll-spy + clique).
 */
export function PerfilSectionCard({
  id,
  icon: Icon,
  title,
  description,
  children,
  className,
}: Props) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-24 overflow-hidden rounded-xl border bg-card shadow-xs', className)}
    >
      <header className="flex items-start gap-3 border-b px-6 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-base tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{description}</p>
          )}
        </div>
      </header>
      <div className="p-6">{children}</div>
    </section>
  )
}
