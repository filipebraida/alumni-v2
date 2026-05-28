import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import type { Opcao } from '~/components/respostas/types'

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring'

/** Ações comuns (Salvar / Cancelar) ao pé de um editor — alinhadas à direita,
 *  primário mais à direita, no mesmo padrão das ações do card. */
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
  onSalvar,
  onCancelar,
}: {
  valorInicial: string
  placeholder?: string
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
          placeholder="Cidade"
          onChange={(e) => setCidade(e.target.value)}
        />
        <Input
          nativeInput
          size="lg"
          value={uf}
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

export function EditorPos({
  inicial,
  grauOpcoes,
  statusOpcoes,
  onSalvar,
  onCancelar,
}: {
  inicial: { grau: string; curso: string; inst: string; status: string }
  grauOpcoes: Opcao[]
  statusOpcoes: Opcao[]
  onSalvar: (valor: { grau: string; curso: string; inst: string; status: string }) => void
  onCancelar: () => void
}) {
  const [grau, setGrau] = useState(inicial.grau)
  const [curso, setCurso] = useState(inicial.curso)
  const [inst, setInst] = useState(inicial.inst)
  const [status, setStatus] = useState(inicial.status)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <select className={selectClass} value={grau} onChange={(e) => setGrau(e.target.value)}>
          <option value="">Nível…</option>
          {grauOpcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Situação…</option>
          {statusOpcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
        <Input
          nativeInput
          size="lg"
          className="col-span-2"
          value={curso}
          placeholder="Curso"
          onChange={(e) => setCurso(e.target.value)}
        />
        <Input
          nativeInput
          size="lg"
          className="col-span-2"
          value={inst}
          placeholder="Instituição"
          onChange={(e) => setInst(e.target.value)}
        />
      </div>
      <AcoesEditor
        onSalvar={() => onSalvar({ grau, curso, inst, status })}
        onCancelar={onCancelar}
      />
    </div>
  )
}
