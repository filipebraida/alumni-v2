import { ReactElement } from 'react'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

/**
 * Shell focado para fluxos de tarefa (ex.: atualizar dados): paleta clara fixa,
 * sem a navegação do app. O cabeçalho e a barra de ação ficam na própria página
 * (dependem do progresso do fluxo).
 */
export default function FlowLayout({ children }: { children: ReactElement }) {
  useFlashToasts()

  return (
    <div className="portal-theme flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <ToastProvider position="top-center">
        <AnchoredToastProvider>{children}</AnchoredToastProvider>
      </ToastProvider>
    </div>
  )
}
