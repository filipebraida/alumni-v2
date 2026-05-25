import { Link } from '@adonisjs/inertia/react'
import { Menu } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { PortalContainer } from '~/components/portal/container'
import { PortalLogo } from '~/components/portal/logo'
import { Button, buttonVariants } from '~/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPanel,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { cn } from '~/lib/utils'

export type PortalNavKey = 'sobre' | 'egressos' | 'ufrrj' | 'transparencia' | 'ajuda'

type NavItem = {
  key: PortalNavKey
  label: string
  /** Routed sections use a named route; not-yet-built ones fall back to `href`. */
  route?: 'portal.sobre' | 'portal.egressos' | 'portal.ufrrj' | 'portal.transparencia'
  href?: string
}

const navItems: NavItem[] = [
  { key: 'sobre', label: 'Sobre o SAE', route: 'portal.sobre' },
  { key: 'egressos', label: 'Para egressos', route: 'portal.egressos' },
  { key: 'ufrrj', label: 'Para a UFRRJ', route: 'portal.ufrrj' },
  { key: 'transparencia', label: 'Transparência', route: 'portal.transparencia' },
  { key: 'ajuda', label: 'Ajuda', href: '#' },
]

/** Renders a nav item as an Inertia `<Link>` (routed) or a plain `<a>` (placeholder). */
function NavTarget({
  item,
  className,
  onClick,
  children,
}: {
  item: NavItem
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  if (item.route) {
    return (
      <Link route={item.route} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }
  return (
    <a href={item.href ?? '#'} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

/**
 * Shared institutional top bar for every public portal page. Pass `active` to
 * highlight the current section. Below `lg` the secondary links collapse into a
 * Sheet drawer (hamburger), while the "Entrar" CTA stays in the bar at every
 * size. "Entrar" jumps to the login card on the root portal page (`/#login`);
 * "Ajuda" stays a placeholder until its page lands.
 */
export function PortalHeader({ active }: { active?: PortalNavKey }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <PortalContainer className="flex h-16 items-center gap-4 md:gap-8">
        <Link route="home" className="flex items-center gap-2.5">
          <PortalLogo />
          <span className="font-semibold text-sm tracking-tight">
            SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
          </span>
        </Link>

        {/* Desktop nav — Portuguese labels need ~1024px to fit on one line */}
        <nav className="hidden items-center lg:flex">
          {navItems.map((item) => (
            <NavTarget
              key={item.key}
              item={item}
              className={cn(
                'relative inline-flex h-16 items-center px-3.5 text-sm font-medium transition-colors',
                active === item.key
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
              {active === item.key && (
                <span className="absolute inset-x-3.5 bottom-0 h-0.5 rounded-t-full bg-primary" />
              )}
            </NavTarget>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-xs sm:gap-3">
          <a
            href="https://ufrrj.br"
            target="_blank"
            rel="noreferrer"
            className="hidden text-muted-foreground hover:text-foreground sm:inline"
          >
            ufrrj.br ↗
          </a>
          <Link href="/#login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Entrar
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              aria-label="Abrir menu"
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2.5 font-sans">
                  <PortalLogo />
                  <span className="font-semibold text-sm tracking-tight">SAE · UFRRJ</span>
                </SheetTitle>
              </SheetHeader>
              <SheetPanel className="pt-1">
                <nav className="flex flex-col">
                  {navItems.map((item) => (
                    <NavTarget
                      key={item.key}
                      item={item}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        active === item.key
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </NavTarget>
                  ))}
                </nav>

                <div className="mt-4 border-t pt-4">
                  <a
                    href="https://ufrrj.br"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ufrrj.br ↗
                  </a>
                </div>
              </SheetPanel>
            </SheetContent>
          </Sheet>
        </div>
      </PortalContainer>
    </header>
  )
}
