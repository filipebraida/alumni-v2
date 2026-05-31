import { Check } from 'lucide-react'
import { type ReactNode } from 'react'
import { type Data } from '@generated/data'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { MecCard } from '~/components/dashboard/mec_card'
import { FormacaoCamposEmBreve } from '~/components/dashboard/formacao_campos_em_breve'

export function DashboardFormacaoDetail({
  formacao,
}: {
  formacao: Data.Matricula.Variants['forPainel']
}) {
  const pendentes = formacao.camposMec.filter((c) => c.confianca !== 'confirmado').length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <div className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
            Detalhes da formação
          </div>
          <div className="mt-1 font-semibold text-sm leading-snug">{formacao.diploma}</div>
        </div>
        {formacao.camposMec.length === 0 ? null : pendentes > 0 ? (
          <Badge variant="warning">{pendentes}&nbsp;a revisar</Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Check className="size-3" /> em dia
          </Badge>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-px bg-border lg:grid-cols-12">
        <aside className="bg-card p-5 lg:col-span-3">
          <dl className="space-y-2 text-xs">
            <Linha rotulo="Nível" valor={formacao.nivel} />
            <Linha rotulo="Período" valor={formacao.periodo} />
            <Linha rotulo="Campus" valor={formacao.campus} />
            <Linha rotulo="Código" valor={formacao.codigo} />
          </dl>
        </aside>

        <div className="flex flex-col bg-card lg:col-span-9">
          {formacao.camposMec.length === 0 ? (
            <FormacaoCamposEmBreve />
          ) : (
            <div className="grid flex-1 grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {formacao.camposMec.map((campo) => (
                <MecCard key={campo.chave} campo={campo} />
              ))}
            </div>
          )}
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
