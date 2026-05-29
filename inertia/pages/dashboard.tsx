import { Head } from '@inertiajs/react'
import { type ReactElement } from 'react'
import AppLayout from '~/layouts/app'
import { DashboardHero } from '~/components/dashboard/hero'
import { DashboardFrescor } from '~/components/dashboard/frescor'
import { DashboardMecFields } from '~/components/dashboard/mec_fields'
import { DashboardMapaTurma } from '~/components/dashboard/mapa_turma'
import { DashboardReencontro } from '~/components/dashboard/reencontro'
import { DashboardFaixaSalarial } from '~/components/dashboard/faixa_salarial'
import { DashboardTempoEmprego } from '~/components/dashboard/tempo_emprego'
import { DashboardTrajetoria } from '~/components/dashboard/trajetoria'
import type { DashboardData } from '~/components/dashboard/types'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<DashboardData>

export default function Dashboard({
  egresso,
  frescor,
  camposMec,
  mapaTurma,
  colegas,
  carreira,
  experiencias,
}: PageProps) {
  const preenchidos = camposMec.filter((c) => c.valor !== null).length
  const faltando = camposMec.length - preenchidos
  const mapeadoPct = Math.round((mapaTurma.mapeados / mapaTurma.turmaTotal) * 100)

  return (
    <>
      <Head title="Início · SAE UFRRJ" />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <DashboardHero egresso={egresso} faltando={faltando} mapeadoPct={mapeadoPct} />
        </div>
        <div className="lg:col-span-4">
          <DashboardFrescor frescor={frescor} preenchidos={preenchidos} total={camposMec.length} />
        </div>
      </section>

      <DashboardMecFields campos={camposMec} faltando={faltando} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DashboardMapaTurma mapa={mapaTurma} />
        </div>
        <div className="lg:col-span-5">
          <DashboardReencontro colegas={colegas} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <DashboardFaixaSalarial carreira={carreira} />
        </div>
        <div className="lg:col-span-5">
          <DashboardTempoEmprego tempo={carreira.tempoEmprego} />
        </div>
      </section>

      <DashboardTrajetoria experiencias={experiencias} />
    </>
  )
}

Dashboard.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>
