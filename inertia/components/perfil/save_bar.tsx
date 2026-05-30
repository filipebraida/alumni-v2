import { Check } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

type Props = {
  dirty: boolean
  saved: boolean
  processing: boolean
  onSalvar: () => void
  onDescartar: () => void
}

/**
 * Barra inferior que aparece quando há alterações não salvas (e fica mais
 * uns segundos após o save com a confirmação). `fixed` (não `sticky`) pra
 * sair do fluxo do documento — ligar/desligar a barra não muda a altura da
 * página, então o scroll não pula. A área do formulário reserva `pb-24`
 * por padrão pra que o conteúdo final nunca fique embaixo da barra.
 */
export function PerfilSaveBar({ dirty, saved, processing, onSalvar, onDescartar }: Props) {
  const visivel = dirty || saved

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 backdrop-blur transition-all duration-200 ease-out',
        visivel ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      )}
      aria-hidden={!visivel}
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-8',
          visivel && 'pointer-events-auto'
        )}
      >
        {saved ? (
          <div className="flex items-center gap-2 font-medium text-sm text-success-foreground">
            <span className="grid size-6 place-items-center rounded-full bg-success/15">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            Alterações salvas
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="inline-block size-1.5 rounded-full bg-warning" />
            Você tem alterações não salvas
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onDescartar}
            disabled={!dirty || processing}
            className="text-muted-foreground"
          >
            Descartar
          </Button>
          <Button type="button" onClick={onSalvar} disabled={!dirty || processing}>
            <Check /> {processing ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
