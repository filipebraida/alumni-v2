import { Head } from '@inertiajs/react'
import { type ReactElement, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { type Data } from '@generated/data'
import AppLayout from '~/layouts/app'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { DashboardDadosGerais } from '~/components/dashboard/dados_gerais'
import { DashboardFormacaoDetail } from '~/components/dashboard/formacao_detail'
import { DashboardFrescor } from '~/components/dashboard/frescor'
import { DashboardHero } from '~/components/dashboard/hero'
import { FormacaoTab } from '~/components/dashboard/formacao_tab'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  egresso: Data.Egresso.Variants['forPainel']
  frescor: Data.Frescor
  snapshot: Data.SnapshotPainel
  camposGerais: Data.CampoMec[]
  formacoes: Data.Matricula.Variants['forPainel'][]
}>

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

  const pendentesPorFormacao = formacoes.reduce((soma, f) => soma + pendentes(f.camposMec), 0)

  // '—' = sentinela do controller pra "sem resposta arquivada"
  const modo: 'manutencao' | 'primeira' = snapshot.ultimaFoto === '—' ? 'primeira' : 'manutencao'
  const camposVazios =
    camposGerais.filter((c) => c.confianca === 'ausente').length +
    formacoes.reduce((s, f) => s + f.camposMec.filter((c) => c.confianca === 'ausente').length, 0)

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
            globalPendentes={modo === 'primeira' ? camposVazios : pendentesPorFormacao}
            modo={modo}
          />
        </div>
        <div className="lg:col-span-4">
          <DashboardFrescor frescor={frescor} modo={modo} />
        </div>
      </section>

      <DashboardDadosGerais campos={camposGerais} />

      <Card className="overflow-hidden shadow-sm">
        <div className="px-5 pt-5">
          <h2 className="flex items-center gap-2 font-semibold text-base tracking-tight">
            <GraduationCap className="size-4 shrink-0 text-primary" /> Suas formações
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Cada formação tem seus próprios dados. Selecione uma para ver.
          </p>
        </div>

        <div
          data-formacoes-tabs
          className="grid grid-cols-1 gap-3 px-5 pt-4 pb-5 sm:grid-cols-2 lg:grid-cols-3"
        >
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
    </>
  )
}

Dashboard.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>
