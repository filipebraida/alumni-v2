import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { type Opcao } from '~/pages/respostas/create'

// Salvar / Cancelar alinhados à direita (primário mais à direita), no mesmo
// padrão das ações do card.
function AcoesEditor({ onSalvar, onCancelar }: { onSalvar: () => void; onCancelar: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="ghost" onClick={onCancelar}>
        Cancelar
      </Button>
      <Button size="sm" onClick={onSalvar}>
        <Check /> Salvar
      </Button>
    </div>
  )
}

export function EditorTexto({
  valorInicial,
  placeholder,
  ariaLabel,
  onSalvar,
  onCancelar,
}: {
  valorInicial: string
  placeholder?: string
  ariaLabel?: string
  onSalvar: (valor: string) => void
  onCancelar: () => void
}) {
  const [valor, setValor] = useState(valorInicial)
  return (
    <div className="space-y-3">
      <Input
        nativeInput
        size="lg"
        autoFocus
        value={valor}
        aria-label={ariaLabel}
        placeholder={placeholder ?? 'Digite…'}
        onChange={(e) => setValor(e.target.value)}
      />
      <AcoesEditor onSalvar={() => onSalvar(valor)} onCancelar={onCancelar} />
    </div>
  )
}

export function EditorLocal({
  cidadeInicial,
  ufInicial,
  onSalvar,
  onCancelar,
}: {
  cidadeInicial: string
  ufInicial: string
  onSalvar: (valor: { cidade: string; uf: string }) => void
  onCancelar: () => void
}) {
  const [cidade, setCidade] = useState(cidadeInicial)
  const [uf, setUf] = useState(ufInicial)
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Input
          nativeInput
          size="lg"
          autoFocus
          className="col-span-2"
          value={cidade}
          aria-label="Cidade"
          placeholder="Cidade"
          onChange={(e) => setCidade(e.target.value)}
        />
        <Input
          nativeInput
          size="lg"
          value={uf}
          aria-label="UF"
          placeholder="UF"
          maxLength={2}
          onChange={(e) => setUf(e.target.value.toUpperCase())}
        />
      </div>
      <AcoesEditor onSalvar={() => onSalvar({ cidade, uf })} onCancelar={onCancelar} />
    </div>
  )
}

export function EditorOpcoes({
  valorInicial,
  opcoes,
  onSalvar,
  onCancelar,
}: {
  valorInicial: string
  opcoes: Opcao[]
  onSalvar: (valor: string) => void
  onCancelar: () => void
}) {
  return (
    <div className="space-y-2">
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === valorInicial
        return (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => onSalvar(opcao.valor)}
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
              ativo
                ? 'border-primary bg-primary/5 font-medium'
                : 'border-border hover:border-primary/40 hover:bg-muted/40'
            )}
          >
            {opcao.rotulo}
            {ativo && <Check className="size-4 shrink-0 text-primary" />}
          </button>
        )
      })}
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
