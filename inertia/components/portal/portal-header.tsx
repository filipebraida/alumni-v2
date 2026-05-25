import { Link } from '@adonisjs/inertia/react'
import { PortalLogo } from '~/components/portal/logo'
import { cn } from '~/lib/utils'

export type PortalNavKey = 'sobre' | 'egressos' | 'ufrrj' | 'transparencia' | 'ajuda'

const navItemClass = (active: boolean) =>
  cn(
    'relative inline-flex h-16 items-center px-3.5 text-sm font-medium transition-colors',
    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
  )

function ActiveUnderline() {
  return <span className="absolute inset-x-3.5 bottom-0 h-0.5 rounded-t-full bg-primary" />
}

/**
 * Shared institutional top bar for every public portal page. Pass `active` to
 * highlight the current section. "Entrar" jumps to the login card on the root
 * portal page (`/#login`); "Ajuda" stays a placeholder until its page lands.
 */
export function PortalHeader({ active }: { active?: PortalNavKey }) {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-330 items-center gap-8 px-8">
        <Link route="home" className="flex items-center gap-2.5">
          <PortalLogo />
          <span className="font-semibold text-sm tracking-tight">
            SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          <Link route="portal.sobre" className={navItemClass(active === 'sobre')}>
            Sobre o SAE
            {active === 'sobre' && <ActiveUnderline />}
          </Link>
          <Link route="portal.egressos" className={navItemClass(active === 'egressos')}>
            Para egressos
            {active === 'egressos' && <ActiveUnderline />}
          </Link>
          <Link route="portal.ufrrj" className={navItemClass(active === 'ufrrj')}>
            Para a UFRRJ
            {active === 'ufrrj' && <ActiveUnderline />}
          </Link>
          <Link route="portal.transparencia" className={navItemClass(active === 'transparencia')}>
            Transparência
            {active === 'transparencia' && <ActiveUnderline />}
          </Link>
          <a href="#" className={navItemClass(active === 'ajuda')}>
            Ajuda
            {active === 'ajuda' && <ActiveUnderline />}
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3 text-xs">
          <a
            href="https://ufrrj.br"
            target="_blank"
            rel="noreferrer"
            className="hidden text-muted-foreground hover:text-foreground sm:inline"
          >
            ufrrj.br ↗
          </a>
          <a
            href="/#login"
            className="inline-flex h-9 items-center rounded-md border bg-background px-3 font-medium text-sm hover:bg-muted/50"
          >
            Entrar
          </a>
        </div>
      </div>
    </header>
  )
}
