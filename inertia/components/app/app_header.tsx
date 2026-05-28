import { Link } from '@adonisjs/inertia/react'
import { router, usePage } from '@inertiajs/react'
import { Data } from '@generated/data'
import { Bell, LogOut, Search, Settings, User } from 'lucide-react'
import { ReactNode } from 'react'
import { urlFor } from '~/client'
import { PortalContainer } from '~/components/portal/container'
import { PortalLogo } from '~/components/portal/logo'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'
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
 * Top bar do painel do egresso: marca, navegação primária (texto puro, item
 * ativo sublinhado, "Empresas" em estado "em breve"), busca, notificações e o
 * menu do usuário autenticado.
 */
export function AppHeader() {
  const { user } = usePage<Data.SharedProps>().props
  const nomeCompleto = user?.fullName ?? 'Você'
  const primeiroNome = nomeCompleto.split(' ')[0]
  const iniciais = user?.initials ?? '·'

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <PortalContainer className="flex h-16 items-center gap-6 lg:gap-8">
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

          <Menu>
            <MenuTrigger
              className="ml-1 flex cursor-pointer items-center gap-2 rounded-full border bg-background py-1 pr-1 pl-2.5 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-popup-open:bg-muted/40"
              aria-label="Abrir menu do usuário"
            >
              <span className="hidden font-medium text-xs leading-none sm:inline">
                {primeiroNome}
              </span>
              <Avatar className="size-6">
                <AvatarFallback className="bg-primary font-semibold text-primary-foreground text-xs">
                  {iniciais}
                </AvatarFallback>
              </Avatar>
            </MenuTrigger>
            <MenuPopup align="end" className="portal-theme w-56 text-foreground">
              <div className="px-2 py-1.5">
                <p className="truncate font-medium text-foreground text-sm">{nomeCompleto}</p>
                {user?.email && (
                  <p className="truncate text-muted-foreground text-xs">{user.email}</p>
                )}
              </div>
              <MenuSeparator />
              <MenuItem>
                <User /> Meu perfil
              </MenuItem>
              <MenuItem>
                <Settings /> Configurações
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                variant="destructive"
                onClick={() => router.post(urlFor('session.destroy'))}
              >
                <LogOut /> Sair
              </MenuItem>
            </MenuPopup>
          </Menu>
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

function SearchTrigger() {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-md border bg-background pr-1.5 pl-3 text-muted-foreground text-sm transition-colors hover:bg-muted/50 hover:text-foreground"
    >
      <Search className="size-4" />
      <span className="hidden md:inline">Buscar…</span>
      <kbd className="ml-2 hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-medium font-mono text-muted-foreground text-xs md:inline-flex">
        <span>⌘</span>K
      </kbd>
    </button>
  )
}
