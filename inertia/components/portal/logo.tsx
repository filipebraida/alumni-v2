import { cn } from '~/lib/utils'

/**
 * SAE · UFRRJ brand mark — a rounded square monogram ("R") with the crest's
 * yellow dot. Purely visual; callers wrap it in a `<Link>` together with the
 * wordmark. `onDark` inverts it for the dark footer / CTA surfaces.
 */
export function PortalLogo({ onDark = false }: { onDark?: boolean }) {
  return (
    <div
      className={cn(
        'relative grid size-8 place-items-center rounded-md',
        onDark ? 'bg-white text-portal-ink' : 'bg-primary text-primary-foreground'
      )}
    >
      <span className="font-bold leading-none">R</span>
      <span className="-right-0.5 -top-0.5 absolute size-2 rounded-full bg-brand-yellow" />
    </div>
  )
}
