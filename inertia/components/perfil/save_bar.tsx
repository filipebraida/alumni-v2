import { Check } from 'lucide-react'

import { Button } from '~/components/ui/button'

type Props = {
  dirty: boolean
  saved: boolean
  processing: boolean
  onSalvar: () => void
  onDescartar: () => void
  onVoltar: () => void
}

/**
 * Barra inferior do "Editar perfil". Sempre visível — assim o egresso tem
 * sempre como sair (Voltar) ou salvar (mesmo desabilitado, fica claro onde
 * o botão vai aparecer quando houver alteração). `fixed` (não `sticky`) pra
 * sair do fluxo do documento — não altera a altura da página. O conteúdo do
 * formulário reserva `pb-24` por padrão pra não ficar embaixo da barra.
 */
export function PerfilSaveBar({
  dirty,
  saved,
  processing,
  onSalvar,
  onDescartar,
  onVoltar,
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-8">
        {saved ? (
          <div className="flex items-center gap-2 font-medium text-sm text-success-foreground">
            <span className="grid size-6 place-items-center rounded-full bg-success/15">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            Alterações salvas
          </div>
        ) : dirty ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="inline-block size-1.5 rounded-full bg-warning" />
            Você tem alterações não salvas
          </div>
        ) : (
          <div className="text-muted-foreground text-xs">Sem alterações</div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onVoltar}
            disabled={processing}
            className="text-muted-foreground"
          >
            Voltar
          </Button>
          {dirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={onDescartar}
              disabled={processing}
              className="text-muted-foreground"
            >
              Descartar
            </Button>
          )}
          <Button type="button" onClick={onSalvar} disabled={!dirty || processing}>
            <Check /> {processing ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
