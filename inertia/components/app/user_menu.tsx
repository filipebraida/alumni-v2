import { router, usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'
import { Briefcase, LogOut, User } from 'lucide-react'
import { type ReactNode } from 'react'
import { urlFor } from '~/client'
import { ThemeSelector } from '~/components/app/theme_selector'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetPanel,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { cn } from '~/lib/utils'

/**
 * Menu do usuário. No desktop é um dropdown (chip com nome + avatar); no mobile
 * vira uma gaveta inferior (Sheet) com alvos de toque grandes — o dropdown
 * portado não é confiável no toque. Mesma estratégia do `PortalHeader`.
 */
export function UserMenu() {
  const { user, perfil } = usePage<Data.SharedProps>().props
  const nomeCompleto = user?.fullName ?? 'Você'
  const primeiroNome = nomeCompleto.split(' ')[0]
  const iniciais = user?.initials ?? '·'
  const sair = () => router.post(urlFor('session.destroy'))
  // Admin entra na gestão como super-gestor — a sidebar expõe a área administrativa.
  const podeIrParaGestao = perfil?.isGestor || perfil?.isAdmin
  const irParaGestao = () => router.visit(urlFor('gestao.show'))
  const irParaPerfil = () => router.visit(urlFor('perfil.show'))

  const fallback = (
    <AvatarFallback className="bg-primary font-semibold text-primary-foreground text-xs">
      {iniciais}
    </AvatarFallback>
  )

  return (
    <>
      {/* Desktop: dropdown */}
      <Menu>
        <MenuTrigger
          className="ml-1 hidden cursor-pointer items-center gap-2 rounded-full border bg-background py-1 pr-1 pl-2.5 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-popup-open:bg-muted/40 sm:flex"
          aria-label="Abrir menu do usuário"
        >
          <span className="font-medium text-xs leading-none">{primeiroNome}</span>
          <Avatar className="size-6">{fallback}</Avatar>
        </MenuTrigger>
        <MenuPopup align="end" className="w-56 text-foreground">
          <div className="px-2 py-1.5">
            <p className="truncate font-medium text-foreground text-sm">{nomeCompleto}</p>
            {user?.email && <p className="truncate text-muted-foreground text-xs">{user.email}</p>}
          </div>
          <MenuSeparator />
          <MenuItem onClick={irParaPerfil}>
            <User /> Meu perfil
          </MenuItem>
          {podeIrParaGestao && (
            <>
              <MenuSeparator />
              <MenuItem onClick={irParaGestao}>
                <Briefcase /> Área de gestão
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

      {/* Mobile: gaveta */}
      <Sheet>
        <SheetTrigger
          className="ml-1 flex size-9 items-center justify-center rounded-full outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background sm:hidden"
          aria-label="Abrir menu do usuário"
        >
          <Avatar className="size-7">{fallback}</Avatar>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">{fallback}</Avatar>
              <div className="min-w-0">
                <SheetTitle className="truncate text-base">{nomeCompleto}</SheetTitle>
                {user?.email && (
                  <SheetDescription className="truncate">{user.email}</SheetDescription>
                )}
              </div>
            </div>
          </SheetHeader>
          <SheetPanel className="flex flex-col gap-1 pb-8">
            <ItemSheet icon={<User className="size-4" />} onClick={irParaPerfil}>
              Meu perfil
            </ItemSheet>
            {podeIrParaGestao && (
              <ItemSheet icon={<Briefcase className="size-4" />} onClick={irParaGestao}>
                Área de gestão
              </ItemSheet>
            )}
            <div className="mt-2 px-1">
              <p className="mb-1.5 font-medium text-muted-foreground text-xs">Tema</p>
              <ThemeSelector />
            </div>
            <div className="mt-2 border-t pt-2">
              <ItemSheet icon={<LogOut className="size-4" />} onClick={sair} destrutivo>
                Sair
              </ItemSheet>
            </div>
          </SheetPanel>
        </SheetContent>
      </Sheet>
    </>
  )
}

function ItemSheet({
  icon,
  children,
  onClick,
  destrutivo,
}: {
  icon: ReactNode
  children: ReactNode
  onClick?: () => void
  destrutivo?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-2 py-2.5 text-left text-sm transition-colors hover:bg-accent',
        destrutivo ? 'text-destructive-foreground' : 'text-foreground'
      )}
    >
      {icon}
      {children}
    </button>
  )
}
