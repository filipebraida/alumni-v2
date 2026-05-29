import { type ReactNode } from 'react'
import { cn } from '~/lib/utils'

/**
 * Editorial serif heading shared across portal sections. Defaults to the
 * section-level (h2) size and scales responsively on the standard Tailwind type
 * scale; pass `text-*`/`md:text-*` via `className` to size a hero (larger) or a
 * sub-heading (smaller) — `twMerge` resolves the override. For the italic
 * accent the design uses, wrap that fragment in a `<span>` styled by the caller
 * (it varies between `text-foreground/85` and `text-primary`).
 */
export function SectionHeading({
  as: Tag = 'h2',
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={cn(
        'text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl',
        className
      )}
    >
      {children}
    </Tag>
  )
}
