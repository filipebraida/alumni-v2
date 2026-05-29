import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

/**
 * Centered content column shared by every portal surface. Width + responsive
 * gutters live here once, on Tailwind's standard scale (no arbitrary widths),
 * so sections stop repeating the `max-w-330` / `max-w-[1320px]` + bare `px-8`
 * mix and the page stays responsive at every breakpoint.
 */
export function PortalContainer({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
  )
}
