import { router, usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'
import { ChevronDown, GraduationCap, LogOut, Settings, User } from 'lucide-react'

import { urlFor } from '~/client'
import { ThemeSelector } from '~/components/app/theme_selector'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'

/**
 * Dropdown da conta no topo da área de gestão (canto superior direito, como no
 * mock). Espelha o `UserMenu` do egresso: identidade, seletor de tema e "Sair".
 * Mostra "Painel do egresso" quando o usuário acumula os dois perfis.
 */
export function GestaoUserMenu() {
  const { user, perfil } = usePage<Data.SharedProps>().props
  const nome = user?.fullName ?? 'Conta'
  const iniciais = user?.initials ?? '·'
  const sair = () => router.post(urlFor('session.destroy'))

  return (
    <Menu>
      <MenuTrigger
        className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 ps-2.5 pe-1.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-popup-open:bg-muted/60"
        aria-label="Abrir menu da conta"
      >
        <div className="hidden text-right leading-tight sm:block">
          <div className="font-medium text-foreground text-sm">{nome}</div>
          <div className="text-muted-foreground text-xs">
            {perfil?.isAdmin ? 'Administração' : 'Coordenação'}
          </div>
        </div>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground text-xs">
            {iniciais}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </MenuTrigger>

      <MenuPopup align="end" className="w-60 text-foreground">
        <div className="px-2 py-1.5">
          <p className="truncate font-medium text-foreground text-sm">{nome}</p>
          {user?.email && <p className="truncate text-muted-foreground text-xs">{user.email}</p>}
        </div>

        <MenuSeparator />

        <MenuItem>
          <User /> Meu perfil
        </MenuItem>
        <MenuItem>
          <Settings /> Configurações da conta
        </MenuItem>

        {perfil?.isEgresso && (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => router.visit(urlFor('dashboard'))}>
              <GraduationCap /> Painel do egresso
            </MenuItem>
          </>
        )}

        <MenuSeparator />

        <div className="px-2 py-1.5">
          <p className="mb-1.5 font-medium text-muted-foreground text-xs">Tema</p>
          <ThemeSelector />
        </div>

        <MenuSeparator />

        <MenuItem variant="destructive" onClick={sair}>
          <LogOut /> Sair
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
