import * as React from 'react'
import { Data } from '@generated/data'
import { router, usePage } from '@inertiajs/react'
import { Link, Form } from '@adonisjs/inertia/react'
import { GraduationCap, LayoutDashboard, LineChart, Users } from 'lucide-react'
import { urlFor } from '~/client'
import { CursoSwitcher } from '~/components/gestao/curso_switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import { Menu, MenuTrigger, MenuItem, MenuPopup } from '~/components/ui/menu'

export function GestaoSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const page = usePage<Data.SharedProps>()
  const { user, perfil } = page.props

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <CursoSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={urlFor('gestao.show')} />}
                isActive={page.url === '/gestao'}
              >
                <LayoutDashboard />
                <span>Visão geral</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Próximas telas da área — estrutura visível, ligação em breve. */}
            <SidebarMenuItem>
              <SidebarMenuButton disabled tooltip="Em breve">
                <Users />
                <span>Egressos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton disabled tooltip="Em breve">
                <LineChart />
                <span>Estatísticas</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <Menu>
          <MenuTrigger
            render={
              <button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground" />
            }
          >
            {user && (
              <span className="flex size-7 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
                {user.initials}
              </span>
            )}
            <span>{user?.fullName ?? 'Conta'}</span>
          </MenuTrigger>
          <MenuPopup>
            {perfil?.isEgresso && (
              <MenuItem onClick={() => router.visit(urlFor('dashboard'))}>
                <GraduationCap /> Painel do egresso
              </MenuItem>
            )}
            <MenuItem>
              <Form route="session.destroy">
                <button type="submit">Sair</button>
              </Form>
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarFooter>
    </Sidebar>
  )
}
