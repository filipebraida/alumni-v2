import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

type Tone = 'primary' | 'yellow' | 'success'

const tones: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  yellow: 'bg-brand-yellow/15 text-warning-foreground',
  success: 'bg-success/10 text-success-foreground',
}

/** Small soft pill used across portal pages (eyebrows, status, tags). */
export function SoftBadge({
  tone = 'primary',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
