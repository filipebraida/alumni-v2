import {
  Briefcase,
  Check,
  Clock,
  Flag,
  LineChart,
  MapPin,
  Plus,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { SoftBadge } from '~/components/portal/soft_badge'
import { EditorLocal, EditorOpcoes, EditorTexto } from '~/components/respostas/editores'
import { cn } from '~/lib/utils'
import { type Opcoes } from '~/pages/respostas/create'

export type Status = 'pendente' | 'confirmado' | 'atualizado'

export type EditorTipo = 'texto' | 'opcoes' | 'local'

export type CampoConfig = {
  id: string
  icone: string
  rotulo: string
  ajuda?: string
  editor: EditorTipo
  campo?: string
  opcoesKey?: keyof Opcoes
}

const ICONES: Record<string, LucideIcon> = {
  pin: MapPin,
  briefcase: Briefcase,
  star: Star,
  flag: Flag,
  chart: LineChart,
  check: Check,
  clock: Clock,
}

type Patch = Record<string, string | null>

function valorExibido(config: CampoConfig, data: Patch, opcoes: Opcoes): string {
  if (config.editor === 'local') {
    return data.localizacaoCidade
      ? `${data.localizacaoCidade} · ${data.localizacaoUf ?? ''}`.trim()
      : ''
  }
  if (config.editor === 'opcoes') {
    return opcoes[config.opcoesKey!].find((o) => o.valor === data[config.campo!])?.rotulo ?? ''
  }
  return data[config.campo!] ?? ''
}

type Props = {
  config: CampoConfig
  data: Patch
  opcoes: Opcoes
  status: Status
  editando: boolean
  onConfirmar: () => void
  onEditar: () => void
  onSalvar: (patch: Patch) => void
  onCancelar: () => void
}

export function CampoAtualizavel({
  config,
  data,
  opcoes,
  status,
  editando,
  onConfirmar,
  onEditar,
  onSalvar,
  onCancelar,
}: Props) {
  const Icone = ICONES[config.icone] ?? Check
  const display = valorExibido(config, data, opcoes)
  const ausente = display === ''
  const confirmado = status === 'confirmado'
  const atualizado = status === 'atualizado'

  return (
    <Card data-campo={config.id} className={cn('overflow-hidden', editando && 'border-primary/40')}>
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className={cn(
                'mt-0.5 grid size-9 shrink-0 place-items-center rounded-md',
                ausente ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
              )}
            >
              <Icone className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-sm">{config.rotulo}</span>
                {confirmado && (
                  <SoftBadge tone="success">
                    <Check className="size-3" /> Mantido
                  </SoftBadge>
                )}
                {atualizado && <SoftBadge tone="primary">Atualizado</SoftBadge>}
              </div>

              <div
                className={cn(
                  'mt-0.5 text-sm',
                  ausente ? 'text-muted-foreground italic' : 'text-foreground'
                )}
              >
                {display || 'não informado'}
              </div>

              {config.ajuda && !editando && (
                <div className="mt-1 text-muted-foreground text-xs">{config.ajuda}</div>
              )}
            </div>
          </div>

          {!editando && (
            <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-start">
              {ausente && status === 'pendente' ? (
                <Button size="sm" variant="outline" onClick={onEditar}>
                  <Plus /> Adicionar
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={onEditar}
                  >
                    Mudou
                  </Button>
                  {status === 'pendente' && (
                    <Button size="sm" onClick={onConfirmar}>
                      <Check /> Sim, ainda
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {editando && (
          <div className="mt-3 rounded-lg border bg-muted/20 p-3">
            {config.editor === 'local' ? (
              <EditorLocal
                cidadeInicial={data.localizacaoCidade ?? ''}
                ufInicial={data.localizacaoUf ?? ''}
                onSalvar={({ cidade, uf }) =>
                  onSalvar({
                    localizacaoCidade: cidade.trim() || null,
                    localizacaoUf: uf.trim() || null,
                    localizacaoPais: data.localizacaoPais ?? 'Brasil',
                  })
                }
                onCancelar={onCancelar}
              />
            ) : config.editor === 'opcoes' ? (
              <EditorOpcoes
                valorInicial={data[config.campo!] ?? ''}
                opcoes={opcoes[config.opcoesKey!]}
                onSalvar={(valor) => onSalvar({ [config.campo!]: valor })}
                onCancelar={onCancelar}
              />
            ) : (
              <EditorTexto
                valorInicial={data[config.campo!] ?? ''}
                ariaLabel={config.rotulo}
                onSalvar={(valor) => onSalvar({ [config.campo!]: valor.trim() || null })}
                onCancelar={onCancelar}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
