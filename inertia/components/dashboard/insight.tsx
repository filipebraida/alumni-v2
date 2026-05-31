import { Clock, LineChart, PieChart } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import { DistList } from '~/components/dashboard/dist_list'
import { SalaryBars } from '~/components/dashboard/salary_bars'
import type { Formacao, Insight } from '~/components/dashboard/types'

/**
 * Insight principal da formação. Pra graduações exibe histograma salarial +
 * destaque da faixa do egresso; pra pós exibe a distribuição de situação
 * (em disciplinas/qualificou/defendeu). Sempre acompanhado por um painel
 * lateral com uma quebra adicional ("tempo até 1º emprego", "linhas de
 * pesquisa") que vem do mesmo `insight`.
 */
export function DashboardInsight({ formacao }: { formacao: Formacao }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-7">
        {formacao.insight.tipo === 'salario' ? (
          <InsightSalario insight={formacao.insight} short={formacao.curto} />
        ) : (
          <InsightSituacao insight={formacao.insight} short={formacao.curto} />
        )}
      </div>
      <div className="lg:col-span-5">
        <InsightLado insight={formacao.insight} />
      </div>
    </section>
  )
}

function InsightSalario({
  insight,
  short,
}: {
  insight: Extract<Insight, { tipo: 'salario' }>
  short: string
}) {
  return (
    <Card className="shadow-sm">
      <DashboardSectionHeader
        icon={LineChart}
        title="Faixa salarial · sua turma"
        description={
          <>
            Mediana:{' '}
            <span className="font-medium text-foreground tabular-nums">{insight.mediana}</span> ·
            agregado e anonimizado
          </>
        }
        action={<Badge variant="secondary">{short}</Badge>}
      />
      <CardContent className="pb-5">
        <SalaryBars faixas={insight.faixas} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-muted-foreground text-xs">
          <span>
            Sua faixa: <span className="font-medium text-foreground">{insight.suaFaixa}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-sm bg-primary" /> Você
            <span className="ml-2 inline-block size-2 rounded-sm bg-primary/25" /> Demais egressos
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function InsightSituacao({
  insight,
  short,
}: {
  insight: Extract<Insight, { tipo: 'situacao' }>
  short: string
}) {
  return (
    <Card className="shadow-sm">
      <DashboardSectionHeader
        icon={PieChart}
        title="Situação da turma"
        description={`${insight.resumo} · agregado`}
        action={<Badge variant="secondary">{short}</Badge>}
      />
      <CardContent className="pb-5">
        <DistList items={insight.distribuicao} />
      </CardContent>
    </Card>
  )
}

function InsightLado({ insight }: { insight: Insight }) {
  return (
    <Card className="shadow-sm">
      <DashboardSectionHeader
        icon={Clock}
        title={insight.ladoTitulo}
        description={
          <>
            Mediana da turma:{' '}
            <span className="font-medium text-foreground tabular-nums">{insight.ladoMediana}</span>
          </>
        }
      />
      <CardContent className="space-y-3 pb-5">
        <DistList items={insight.ladoDistribuicao} compact />
        <div className="pt-1 text-muted-foreground text-xs italic">{insight.ladoEgresso}</div>
      </CardContent>
    </Card>
  )
}
