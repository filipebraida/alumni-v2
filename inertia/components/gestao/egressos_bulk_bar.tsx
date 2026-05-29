import { BellIcon, DownloadIcon, XIcon } from 'lucide-react'

import { cn } from '~/lib/utils'

/**
 * Barra de ações em massa que sobe quando há egressos selecionados (padrão do
 * mock, adaptado ao modelo de frescor do projeto): exportar CSV (real) e pedir
 * atualização do questionário (em breve). Superfície escura institucional.
 */
export function EgressosBulkBar({
  quantidade,
  onExportar,
  onPedirAtualizacao,
  onLimpar,
}: {
  quantidade: number
  onExportar: () => void
  onPedirAtualizacao: () => void
  onLimpar: () => void
}) {
  const aberto = quantidade > 0

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 transition-all duration-200',
        aberto ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      aria-hidden={!aberto}
    >
      <div
        className={cn(
          'pointer-events-auto flex items-center gap-2 rounded-2xl border bg-portal-ink py-2.5 pr-2.5 pl-4 text-portal-ink-foreground shadow-lg',
          !aberto && 'invisible'
        )}
      >
        <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 font-bold text-primary-foreground text-xs tabular-nums">
          {quantidade}
        </span>
        <span className="font-medium text-sm">selecionado{quantidade === 1 ? '' : 's'}</span>

        <span className="mx-1.5 h-6 w-px bg-white/15" />

        <button
          type="button"
          onClick={onPedirAtualizacao}
          disabled
          title="Em breve"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-yellow px-3.5 font-semibold text-sm text-warning-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <BellIcon className="size-4" /> Pedir atualização
        </button>
        <button
          type="button"
          onClick={onExportar}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 font-medium text-sm text-portal-ink-foreground/80 transition-colors hover:bg-white/10 hover:text-portal-ink-foreground"
        >
          <DownloadIcon className="size-4" /> Exportar CSV
        </button>
        <button
          type="button"
          onClick={onLimpar}
          aria-label="Limpar seleção"
          className="flex size-9 items-center justify-center rounded-lg text-portal-ink-foreground/60 transition-colors hover:bg-white/10 hover:text-portal-ink-foreground"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
