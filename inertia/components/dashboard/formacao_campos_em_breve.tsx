import { Clock } from 'lucide-react'

/**
 * Placeholder pro detalhe de formações de pós-graduação nesta entrega: o
 * modelo `RespostaCurso` ainda não carrega campos próprios pra pós (status,
 * bolsa, continuidade). A view exibe a microcopy de espera até a change D2
 * trazer a matriz CAPES por modalidade.
 */
export function FormacaoCamposEmBreve() {
  return (
    <div className="flex flex-col items-start gap-2 p-5 text-sm">
      <span className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
        <Clock className="size-4" />
      </span>
      <span className="font-medium">Campos da formação chegam em breve</span>
      <span className="text-muted-foreground text-xs">
        Pós-graduações ainda estão com identidade-só nesta entrega.
      </span>
    </div>
  )
}
