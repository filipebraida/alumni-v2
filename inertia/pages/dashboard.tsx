import { Head } from '@inertiajs/react'
import { type ReactElement, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { DashboardConfirmBar } from '~/components/dashboard/confirm_bar'
import { DashboardDadosGerais } from '~/components/dashboard/dados_gerais'
import { DashboardFormacaoDetail } from '~/components/dashboard/formacao_detail'
import { DashboardFrescor } from '~/components/dashboard/frescor'
import { DashboardHero } from '~/components/dashboard/hero'
import { DashboardInsight } from '~/components/dashboard/insight'
import { DashboardMapaTurma } from '~/components/dashboard/mapa_turma'
import { DashboardReencontro } from '~/components/dashboard/reencontro'
import { DashboardScopeBar } from '~/components/dashboard/scope_bar'
import { FormacaoTab } from '~/components/dashboard/formacao_tab'
import type { DashboardData } from '~/components/dashboard/types'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<DashboardData>

/** Conta itens MEC com confiança != confirmado. */
const pendentes = (campos: { confianca: string }[]) =>
  campos.filter((c) => c.confianca !== 'confirmado').length

export default function Dashboard({
  egresso,
  frescor,
  snapshot,
  camposGerais,
  formacoes,
}: PageProps) {
  const [ativaIdx, setAtivaIdx] = useState(0)
  const ativa = formacoes[ativaIdx]

  const concluidas = formacoes.filter((f) => f.status === 'concluido').length
  const emCurso = formacoes.length - concluidas

  const pendentesGerais = pendentes(camposGerais)
  const pendentesPorFormacao = formacoes.reduce(
    (soma, f) => soma + pendentes(f.camposMec),
    0
  )
  const globalPendentes = pendentesGerais + pendentesPorFormacao

  const contextoTurma = `${ativa.curto} · ${ativa.rotuloTurma}`

  return (
    <>
      <Head title="Início · alumni SAE UFRRJ" />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardHero
            egresso={egresso}
            totalFormacoes={formacoes.length}
            concluidas={concluidas}
            emCurso={emCurso}
            globalPendentes={globalPendentes}
          />
        </div>
        <div className="lg:col-span-4">
          <DashboardFrescor
            frescor={frescor}
            totalFormacoes={formacoes.length}
            globalPendentes={globalPendentes}
          />
        </div>
      </section>

      <DashboardDadosGerais campos={camposGerais} />

      <Card className="overflow-hidden shadow-sm">
        <div className="px-5 pt-5">
          <h2 className="flex items-center gap-2 font-semibold text-base tracking-tight">
            <GraduationCap className="size-4 shrink-0 text-primary" /> Suas formações
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Selecione uma formação — turma, colegas e insights abaixo se ajustam a ela. Os dados de
            todas entram na mesma foto.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 px-5 pt-4 pb-5 sm:grid-cols-2 lg:grid-cols-3">
          {formacoes.map((f, i) => (
            <FormacaoTab
              key={f.id}
              formacao={f}
              selecionada={i === ativaIdx}
              onSelecionar={() => setAtivaIdx(i)}
            />
          ))}
        </div>

        <Separator />
        <DashboardFormacaoDetail formacao={ativa} />
      </Card>

      <DashboardScopeBar formacao={ativa} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DashboardMapaTurma mapa={ativa.mapa} contexto={contextoTurma} />
        </div>
        <div className="lg:col-span-5">
          <DashboardReencontro
            colegas={ativa.colegas}
            total={ativa.totalColegas}
            contexto={ativa.curto}
          />
        </div>
      </section>

      <DashboardInsight formacao={ativa} />

      <DashboardConfirmBar snapshot={snapshot} globalPendentes={globalPendentes} />
    </>
  )
}

Dashboard.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>
