import { type ReactElement } from 'react'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

/**
 * Shell focado para fluxos de tarefa (ex.: atualizar dados): sem a navegação do
 * app, seguindo o tema do usuário. O cabeçalho e a barra de ação ficam na
 * própria página (dependem do progresso do fluxo).
 */
export default function FlowLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <ToastProvider position="top-center">
        <AnchoredToastProvider>{children}</AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
