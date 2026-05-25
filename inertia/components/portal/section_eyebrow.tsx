import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

/**
 * Uppercase tracking label that opens most portal sections (e.g. "§ 01 ·
 * Relatórios anuais"). Owns the eyebrow type treatment once, on the standard
 * Tailwind scale, instead of repeating `text-[11px] tracking-[0.18em]`.
 */
export function SectionEyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn('text-xs font-medium uppercase tracking-widest text-muted-foreground', className)}>
      {children}
    </p>
  )
}
