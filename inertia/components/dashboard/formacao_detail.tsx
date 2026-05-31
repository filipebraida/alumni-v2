import { Check, FileText } from 'lucide-react'
import { type ReactNode } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { MecCard } from '~/components/dashboard/mec_card'
import type { Formacao } from '~/components/dashboard/types'

/**
 * Detalhe da formação ativa: à esquerda um sumário (nível, período, campus,
 * mapeados) com link pro histórico; à direita os campos MEC específicos
 * daquela formação. Cabe abaixo do seletor de formações.
 */
export function DashboardFormacaoDetail({ formacao }: { formacao: Formacao }) {
  const pendentes = formacao.camposMec.filter((c) => c.confianca !== 'confirmado').length

  return (
    <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-12">
      <aside className="bg-card p-5 lg:col-span-3">
        <div className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
          Sobre esta formação
        </div>
        <div className="mt-2 font-semibold text-sm leading-snug">{formacao.diploma}</div>
        <dl className="mt-3 space-y-2 text-xs">
          <Linha rotulo="Nível" valor={formacao.nivel} />
          <Linha rotulo="Período" valor={formacao.periodo} />
          <Linha rotulo="Campus" valor={formacao.campus} />
          <Linha
            rotulo="Turma"
            valor={`${formacao.mapa.mapeados} de ${formacao.mapa.turmaTotal} mapeados`}
          />
        </dl>
        <Button variant="ghost" size="sm" className="mt-4 -ml-2 h-7 px-2 text-xs">
          <FileText /> Ver histórico
        </Button>
      </aside>

      <div className="bg-card lg:col-span-9">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 pb-2">
          <div className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
            Dados de {formacao.curto}
          </div>
          {pendentes > 0 ? (
            <Badge variant="warning">{pendentes}&nbsp;a revisar</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Check className="size-3" /> em dia
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 gap-px border-t bg-border sm:grid-cols-2 lg:grid-cols-3">
          {formacao.camposMec.map((campo) => (
            <MecCard key={campo.chave} campo={campo} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Linha({ rotulo, valor }: { rotulo: string; valor: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className="text-right font-medium text-foreground">{valor}</dd>
    </div>
  )
}
