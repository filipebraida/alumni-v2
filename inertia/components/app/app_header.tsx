import { Link } from '@adonisjs/inertia/react'
import { Bell, Menu, Search } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { PortalContainer } from '~/components/portal/container'
import { PortalLogo } from '~/components/portal/logo'
import { UserMenu } from '~/components/app/user_menu'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetPanel,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { cn } from '~/lib/utils'

type NavItem = {
  label: string
  /** Seções já roteadas usam o nome da rota; as demais são placeholders. */
  route?: 'dashboard'
  active?: boolean
  soon?: boolean
}

const navItems: NavItem[] = [
  { label: 'Início', route: 'dashboard', active: true },
  { label: 'Egressos' },
  { label: 'Análises' },
  { label: 'Empresas', soon: true },
]

/**
 * Top bar do painel do egresso: marca, navegação primária, busca, notificações
 * e o menu do usuário. Abaixo de `md` a navegação colapsa numa gaveta
 * (hambúrguer) e a busca some — a barra fica enxuta. O menu do usuário
 * (`UserMenu`) é responsivo por conta própria.
 */
export function AppHeader() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <PortalContainer className="flex h-16 items-center gap-3 sm:gap-6 lg:gap-8">
        {/* Navegação mobile (hambúrguer) */}
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
            aria-label="Abrir navegação"
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="font-sans text-sm">
                <Link
                  route="dashboard"
                  onClick={() => setNavOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <PortalLogo />
                  <span className="font-semibold tracking-tight">SAE · UFRRJ</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <SheetPanel className="pt-1">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <NavSheetLink key={item.label} item={item} onClick={() => setNavOpen(false)} />
                ))}
              </nav>
            </SheetPanel>
          </SheetContent>
        </Sheet>

        <Link route="dashboard" className="flex items-center gap-2.5">
          <PortalLogo />
          <span className="font-semibold text-sm tracking-tight">
            SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchTrigger />
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
            <Bell />
            <span className="absolute top-2 right-2 size-1.5 rounded-full bg-brand-yellow" />
          </Button>
          <UserMenu />
        </div>
      </PortalContainer>
    </header>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const className = cn(
    'relative inline-flex h-16 items-center px-4 font-medium text-sm transition-colors',
    item.active
      ? 'text-foreground'
      : item.soon
        ? 'text-muted-foreground/60 hover:text-muted-foreground'
        : 'text-muted-foreground hover:text-foreground'
  )

  const content: ReactNode = (
    <>
      {item.label}
      {item.active && (
        <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-t-sm bg-primary" />
      )}
      {item.soon && (
        <span className="ml-1.5 size-1 rounded-full bg-brand-yellow" title="Em breve" />
      )}
    </>
  )

  if (item.route) {
    return (
      <Link route={item.route} className={className}>
        {content}
      </Link>
    )
  }
  return (
    <a href="#" className={className}>
      {content}
    </a>
  )
}

function NavSheetLink({ item, onClick }: { item: NavItem; onClick: () => void }) {
  const className = cn(
    'flex items-center justify-between rounded-md px-3 py-2.5 font-medium text-sm transition-colors',
    item.active
      ? 'bg-primary/10 text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  )

  const content: ReactNode = (
    <>
      {item.label}
      {item.soon && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 font-normal text-muted-foreground text-xs">
          em breve
        </span>
      )}
    </>
  )

  if (item.route) {
    return (
      <Link route={item.route} onClick={onClick} className={className}>
        {content}
      </Link>
    )
  }
  return (
    <a href="#" onClick={onClick} className={className}>
      {content}
    </a>
  )
}

function SearchTrigger() {
  return (
    <button
      type="button"
      className="hidden h-9 items-center gap-2 rounded-md border bg-background pr-1.5 pl-3 text-muted-foreground text-sm transition-colors hover:bg-muted/50 hover:text-foreground md:inline-flex"
    >
      <Search className="size-4" />
      <span className="hidden md:inline">Buscar…</span>
      <kbd className="ml-2 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-medium font-mono text-muted-foreground text-xs md:inline-flex">
        <span>⌘</span>K
      </kbd>
    </button>
  )
}
