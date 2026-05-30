import { Check } from 'lucide-react'

import { Button } from '~/components/ui/button'

type Props = {
  dirty: boolean
  saved: boolean
  processing: boolean
  onSalvar: () => void
  onDescartar: () => void
}

/**
 * Barra inferior fixa que aparece quando há alterações não salvas (e fica
 * mais 1s após o save com mensagem de sucesso). `sticky bottom-0` pra grudar
 * no fim do scroll do conteúdo — funciona dentro do main do AppLayout.
 */
export function PerfilSaveBar({ dirty, saved, processing, onSalvar, onDescartar }: Props) {
  if (!dirty && !saved) return null

  return (
    <div className="sticky bottom-0 z-10 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-8">
        {saved ? (
          <div className="flex items-center gap-2 font-medium text-success-foreground text-sm">
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
