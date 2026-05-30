import { type ReactNode } from 'react'

/**
 * Container padrão de uma página da gestão dentro do `SidebarInset` —
 * `p-4 sm:p-6` no envelope e `space-y-6` entre blocos. Use junto com o
 * `GestaoPageHeader` no topo do conteúdo.
 */
export function GestaoPage({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">{children}</div>
    </div>
  )
}

/**
 * Header padrão da página: título grande + subtítulo opcional, com slot
 * de ações alinhado à direita (botões, links, dialogs).
 */
export function GestaoPageHeader({
  titulo,
  subtitulo,
  acoes,
}: {
  titulo: ReactNode
  subtitulo?: ReactNode
  acoes?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-semibold text-2xl leading-tight tracking-tight">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-muted-foreground text-sm">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  )
}
