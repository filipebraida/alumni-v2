import { type ReactElement } from 'react'
import { AppHeader } from '~/components/app/app_header'
import { PortalContainer } from '~/components/portal/container'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

/**
 * Shell autenticado do egresso: barra superior fixa + área de conteúdo central.
 * Diferente do `PortalLayout` (público) e do antigo layout de sidebar — aqui a
 * navegação primária vive numa top bar, como na "Síntese" do design.
 *
 * Segue o tema escolhido pelo usuário (claro/escuro/sistema, via `ThemeProvider`
 * + classe `html.dark`); o seletor vive no menu do usuário (`AppHeader`).
 */
export default function AppLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 font-sans text-foreground antialiased">
      <AppHeader />
      <ToastProvider position="top-center">
        <AnchoredToastProvider>
          <main className="flex-1">
            <PortalContainer className="space-y-6 py-6">{children}</PortalContainer>
          </main>
        </AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
