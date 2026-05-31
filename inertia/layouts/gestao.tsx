import { type ReactElement } from 'react'
import { usePage } from '@inertiajs/react'
import { ChevronRightIcon } from 'lucide-react'

import { useFlashToasts } from '~/hooks/use_flash'
import { NotificationBell } from '~/components/app/notification_bell'
import { GestaoSidebar } from '~/components/gestao/gestao_sidebar'
import { GestaoUserMenu } from '~/components/gestao/gestao_user_menu'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { type Data } from '@generated/data'

/** Rótulo da página atual no breadcrumb, derivado da URL (mapa explícito). */
function rotuloDaPagina(url: string): string {
  if (url.startsWith('/gestao/egressos')) return 'Egressos'
  if (url === '/gestao' || url.startsWith('/gestao?')) return 'Visão geral'
  if (url.startsWith('/admin/institutos')) return 'Institutos'
  if (url.startsWith('/admin/cursos')) return 'Cursos'
  if (url.startsWith('/admin/usuarios')) return 'Usuários'
  return 'Gestão'
}

function secaoDaPagina(url: string): string {
  if (url.startsWith('/admin/')) return 'Administração'
  return 'Gestão'
}

/**
 * Shell da área de gestão: sidebar com CursoSwitcher (tenant = curso) +
 * top bar compartilhado (breadcrumb + sino + menu do usuário) + conteúdo.
 * O curso ativo vive na sessão e é resolvido pelo `gestor` middleware.
 */
export default function GestaoLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  const { gestao } = usePage<{ gestao: Data.GestaoShared }>().props
  const url = usePage().url
  const curso = gestao.cursos.find((c) => c.id === gestao.cursoAtivoId) ?? null
  const pagina = rotuloDaPagina(url)
  const secao = secaoDaPagina(url)

  return (
    <SidebarProvider>
      <GestaoSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <nav className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span>{url.startsWith('/admin/') ? secao : (curso?.nivel ?? secao)}</span>
            <ChevronRightIcon className="size-3.5 opacity-50" />
            <span className="font-medium text-foreground">{pagina}</span>
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <NotificationBell />
            <span className="h-5 w-px bg-border" />
            <GestaoUserMenu />
          </div>
        </header>

        <ToastProvider position="top-center">
          <AnchoredToastProvider>{children}</AnchoredToastProvider>
        </ToastProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
