import { type ReactElement } from 'react'
import { useFlashToasts } from '~/hooks/use_flash'
import { GestaoSidebar } from '~/components/gestao/gestao_sidebar'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'

/**
 * Shell da área de gestão: sidebar com CursoSwitcher (tenant = curso) + conteúdo.
 * O curso ativo vive na sessão e é resolvido pelo `gestor` middleware.
 */
export default function GestaoLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <SidebarProvider>
      <GestaoSidebar />
      <SidebarInset>
        <ToastProvider position="top-center">
          <AnchoredToastProvider>{children}</AnchoredToastProvider>
        </ToastProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
