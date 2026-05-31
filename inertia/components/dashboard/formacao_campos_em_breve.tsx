import { Clock } from 'lucide-react'

// `RespostaCurso` só carrega campos próprios de graduação nesta entrega; pós
// (status, bolsa, continuidade) vem com a matriz CAPES numa change futura.
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
