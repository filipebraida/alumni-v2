import { type ReactNode } from 'react'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'
import { cn } from '~/lib/utils'

/**
 * The eyebrow + serif heading (+ optional right-aligned aside) block that opens
 * most portal sections. Standardizes the 12-col layout that was hand-built — at
 * varying 7/5 and 8/4 splits — in every section. Pass the heading content as
 * children (wrap the accent fragment in `<em>`).
 */
export function SectionHeader({
  eyebrow,
  aside,
  className,
  headingClassName,
  children,
}: {
  eyebrow: ReactNode
  aside?: ReactNode
  className?: string
  headingClassName?: string
  children: ReactNode
}) {
  return (
    <div className={cn('grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10', className)}>
      <div className={aside ? 'md:col-span-8' : 'md:col-span-12'}>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <SectionHeading className={cn('mt-2', headingClassName)}>{children}</SectionHeading>
      </div>
      {aside ? (
        <div className="text-sm text-muted-foreground md:col-span-4 md:text-right">{aside}</div>
      ) : null}
    </div>
  )
}
