import * as React from 'react'
import { type Data } from '@generated/data'
import { router, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { FileBarChart, FileText, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react'
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

/**
 * Reescala os tokens da sidebar shadcn para a superfície escura institucional
 * (mesma cor do chrome do portal, `--portal-ink`). Tudo via CSS custom
 * properties: nenhuma classe arbitrária e nenhuma edição de app.css.
 */
const temaSidebarEscuro = {
  '--sidebar': 'var(--portal-ink)',
  '--sidebar-foreground': 'var(--portal-ink-foreground)',
  '--sidebar-primary': 'var(--primary)',
  '--sidebar-primary-foreground': 'var(--primary-foreground)',
  '--sidebar-accent': 'color-mix(in srgb, var(--portal-ink) 86%, white)',
  '--sidebar-accent-foreground': 'var(--portal-ink-foreground)',
  '--sidebar-border': 'color-mix(in srgb, var(--portal-ink) 78%, white)',
  '--sidebar-ring': 'var(--ring)',
} as React.CSSProperties

/** Item ativo vira "pílula" verde (sidebar-primary), como na proposta. */
const navAtivo =
  'data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground data-[active=true]:hover:bg-sidebar-primary data-[active=true]:hover:text-sidebar-primary-foreground'

export function GestaoSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const page = usePage<Data.SharedProps>()
  const { user } = page.props

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="text-sidebar-foreground"
      style={temaSidebarEscuro}
    >
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-bold text-sidebar-primary-foreground text-sm">
            R
            <span className="-right-0.5 -top-0.5 absolute size-2 rounded-full bg-brand-yellow" />
          </div>
          <div className="font-semibold text-sm tracking-tight group-data-[collapsible=icon]:hidden">
            SAE <span className="font-normal text-sidebar-foreground/55">· Coordenação</span>
          </div>
        </div>
        <CursoSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={navAtivo}
                tooltip="Visão geral"
                render={<Link href={urlFor('gestao.show')} />}
                isActive={page.url === '/gestao'}
              >
                <LayoutDashboard />
                <span>Visão geral</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className={navAtivo}
                tooltip="Egressos"
                render={<Link href={urlFor('gestao.egressos')} />}
                isActive={page.url.startsWith('/gestao/egressos')}
              >
                <Users />
                <span>Egressos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Próximas telas da área — estrutura visível, ligação em breve. */}
            <SidebarMenuItem>
              <SidebarMenuButton disabled tooltip="Em breve">
                <FileText />
                <span>Questionários</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton disabled tooltip="Em breve">
                <FileBarChart />
                <span>Relatórios MEC</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton disabled tooltip="Em breve">
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-lg px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground text-xs group-data-[collapsible=icon]:size-8">
            {user?.initials ?? '—'}
          </span>
          <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <div className="truncate font-medium text-sm">{user?.fullName ?? 'Conta'}</div>
            <div className="truncate text-sidebar-foreground/55 text-xs">Coordenação</div>
          </div>
          <button
            type="button"
            onClick={() => router.post(urlFor('session.destroy'))}
            aria-label="Sair"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
