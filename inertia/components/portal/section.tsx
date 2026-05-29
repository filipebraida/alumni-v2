import { type ReactNode } from 'react'
import { PortalContainer } from '~/components/portal/container'
import { cn } from '~/lib/utils'

type Surface = 'default' | 'muted'
type Border = 'none' | 'top' | 'bottom' | 'both'

const surfaceClass: Record<Surface, string> = {
  default: 'bg-background',
  muted: 'bg-muted/30',
}

const borderClass: Record<Border, string> = {
  none: '',
  top: 'border-t',
  bottom: 'border-b',
  both: 'border-y',
}

/**
 * Standard portal content band: a full-bleed `<section>` (background + optional
 * hairline borders) wrapping a `PortalContainer` with the shared vertical
 * rhythm. Sections that need bespoke chrome (e.g. heroes with background art)
 * compose `PortalContainer` directly instead of this wrapper.
 */
export function PortalSection({
  id,
  surface = 'default',
  border = 'none',
  className,
  containerClassName,
  children,
}: {
  id?: string
  surface?: Surface
  border?: Border
  className?: string
  containerClassName?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn(surfaceClass[surface], borderClass[border], className)}>
      <PortalContainer className={cn('py-16 md:py-20', containerClassName)}>
        {children}
      </PortalContainer>
    </section>
  )
}
