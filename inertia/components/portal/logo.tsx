import { AlumniMark } from '~/components/alumni_mark'

/**
 * SAE · UFRRJ brand mark — the alumni flower symbol (caule + folhas + flor de
 * sete pétalas), used everywhere the portal needs an institutional anchor.
 * Callers wrap it in a `<Link>` next to the wordmark; `onDark` swaps to the
 * lightened palette tuned for the dark footer / CTA surfaces.
 */
export function PortalLogo({ onDark = false }: { onDark?: boolean }) {
  return <AlumniMark variant={onDark ? 'dark' : 'light'} size={54} />
}
