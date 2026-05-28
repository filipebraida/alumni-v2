import { Head, usePage } from '@inertiajs/react'
import { ReactElement } from 'react'
import GestaoLayout from '~/layouts/gestao'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { InertiaProps } from '~/types'
import type { GestaoShared } from '~/components/gestao/types'

type Estatisticas = {
  totalFormados: number
  emDia: number
  pct: number
}

type PageProps = InertiaProps<{
  estatisticas: Estatisticas | null
}>

function Stat({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="font-semibold text-2xl tabular-nums">{valor}</div>
      <div className="text-muted-foreground text-sm">{rotulo}</div>
    </div>
  )
}

export default function GestaoDashboard({ estatisticas }: PageProps) {
  const { gestao } = usePage<{ gestao: GestaoShared }>().props
  const curso = gestao.cursos.find((c) => c.id === gestao.cursoAtivoId) ?? null

  return (
    <>
      <Head title="Gestão · Visão geral" />

      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="leading-tight">
          <h1 className="font-semibold text-sm">Visão geral</h1>
          <p className="text-muted-foreground text-xs">{curso?.nome ?? 'Nenhum curso'}</p>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat rotulo="Cadastros em dia" valor={`${estatisticas?.pct ?? 0}%`} />
              <Stat rotulo="Em dia" valor={`${estatisticas?.emDia ?? 0}`} />
              <Stat rotulo="Formados" valor={`${estatisticas?.totalFormados ?? 0}`} />
            </div>
            <p className="text-muted-foreground text-sm">
              "Em dia" = egresso com questionário atualizado nos últimos 12 meses.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

GestaoDashboard.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
