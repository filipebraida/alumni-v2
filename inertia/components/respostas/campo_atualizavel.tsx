import {
  Briefcase,
  Check,
  Clock,
  Flag,
  GraduationCap,
  LineChart,
  MapPin,
  Plus,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { SoftBadge } from '~/components/portal/soft_badge'
import { EditorLocal, EditorOpcoes, EditorPos, EditorTexto } from '~/components/respostas/editores'
import { cn } from '~/lib/utils'
import type { CampoConfig, Opcoes, RegistrarResposta, Status } from '~/components/respostas/types'

const ICONES: Record<string, LucideIcon> = {
  pin: MapPin,
  briefcase: Briefcase,
  star: Star,
  flag: Flag,
  chart: LineChart,
  check: Check,
  clock: Clock,
  cap: GraduationCap,
}

/** Valor legível do campo na foto atual (string vazia = não informado). */
function valorExibido(config: CampoConfig, data: RegistrarResposta, opcoes: Opcoes): string {
  if (config.editor === 'local') {
    return data.localizacaoCidade
      ? `${data.localizacaoCidade} · ${data.localizacaoUf ?? ''}`.trim()
      : ''
  }
  if (config.editor === 'pos') {
    if (!data.posGrau) return ''
    const grau = opcoes.posGrau.find((o) => o.valor === data.posGrau)?.rotulo ?? ''
    const status = opcoes.posStatus.find((o) => o.valor === data.posStatus)?.rotulo ?? ''
    const partes = [grau, data.posCurso, data.posInstituicao].filter(Boolean)
    return partes.join(' · ') + (status ? ` · ${status.toLowerCase()}` : '')
  }
  if (config.editor === 'opcoes') {
    return opcoes[config.opcoesKey!].find((o) => o.valor === data[config.campo!])?.rotulo ?? ''
  }
  return data[config.campo!] ?? ''
}

type Props = {
  config: CampoConfig
  data: RegistrarResposta
  opcoes: Opcoes
  status: Status
  editando: boolean
  onConfirmar: () => void
  onEditar: () => void
  onSalvar: (patch: Partial<RegistrarResposta>) => void
  onCancelar: () => void
}

/**
 * Card de um campo no fluxo: mostra o valor atual e oferece "Sim, ainda" /
 * "Mudou" (ou "Adicionar" quando vazio). Ao salvar, devolve só o patch do campo.
 *
 * No mobile as ações descem para baixo do conteúdo (senão espremem o texto) e o
 * editor ocupa a largura cheia do card.
 */
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
    <Card className={cn('overflow-hidden', editando && 'border-primary/40')}>
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {/* ícone + identificação */}
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
                {display || '— não informado'}
              </div>

              {config.ajuda && !editando && (
                <div className="mt-1 text-muted-foreground text-xs">{config.ajuda}</div>
              )}
            </div>
          </div>

          {/* ações — abaixo do conteúdo no mobile, ao lado no desktop */}
          {!editando && (
            <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-start">
              {ausente ? (
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
                  <Button
                    size="sm"
                    variant={confirmado ? 'outline' : 'default'}
                    onClick={onConfirmar}
                  >
                    <Check /> {confirmado ? 'Confirmado' : 'Sim, ainda'}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* editor — largura cheia do card */}
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
            ) : config.editor === 'pos' ? (
              <EditorPos
                inicial={{
                  grau: data.posGrau ?? '',
                  curso: data.posCurso ?? '',
                  inst: data.posInstituicao ?? '',
                  status: data.posStatus ?? '',
                }}
                grauOpcoes={opcoes.posGrau}
                statusOpcoes={opcoes.posStatus}
                onSalvar={({ grau, curso, inst, status: st }) =>
                  onSalvar({
                    posGrau: grau || null,
                    posCurso: curso.trim() || null,
                    posInstituicao: inst.trim() || null,
                    posStatus: st || null,
                  })
                }
                onCancelar={onCancelar}
              />
            ) : config.editor === 'opcoes' ? (
              <EditorOpcoes
                valorInicial={data[config.campo!] ?? ''}
                opcoes={opcoes[config.opcoesKey!]}
                onSalvar={(valor) =>
                  onSalvar({ [config.campo!]: valor } as Partial<RegistrarResposta>)
                }
                onCancelar={onCancelar}
              />
            ) : (
              <EditorTexto
                valorInicial={data[config.campo!] ?? ''}
                onSalvar={(valor) =>
                  onSalvar({ [config.campo!]: valor.trim() || null } as Partial<RegistrarResposta>)
                }
                onCancelar={onCancelar}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
