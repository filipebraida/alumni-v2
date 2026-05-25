import { ReactElement } from 'react'
import { PortalFooter } from '~/components/portal/portal-footer'
import { PortalHeader, PortalNavKey } from '~/components/portal/portal-header'
import { AnchoredToastProvider, ToastProvider } from '~/components/ui/toast'
import { useFlashToasts } from '~/hooks/use_flash'

/**
 * Public portal shell: institutional header + dark footer around the page.
 * The `.portal-theme` wrapper pins the light UFRRJ palette so these pages stay
 * light even when the user's global theme is dark. Pages choose the active nav
 * item: `Page.layout = (page) => <PortalLayout active="sobre">{page}</PortalLayout>`.
 */
export default function PortalLayout({
  children,
  active,
}: {
  children: ReactElement
  active?: PortalNavKey
}) {
  useFlashToasts()

  return (
    <div className="portal-theme flex min-h-screen flex-col bg-background font-sans text-foreground tracking-[-0.005em] antialiased">
      <PortalHeader active={active} />
      <ToastProvider position="top-center">
        <AnchoredToastProvider>
          <main className="flex-1">{children}</main>
        </AnchoredToastProvider>
      </ToastProvider>
      <PortalFooter />
    </div>
  )
}
