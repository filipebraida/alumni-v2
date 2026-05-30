import { Head, usePage } from '@inertiajs/react'
import { type ReactElement } from 'react'
import GestaoLayout from '~/layouts/gestao'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { type InertiaProps } from '~/types'
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

      <GestaoPage>
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <>
            <GestaoPageHeader
              titulo={`Visão geral de ${curso.nome}`}
              subtitulo={`${curso.nivel} · ${curso.instituto} — gestão da coordenação`}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat rotulo="Cadastros em dia" valor={`${estatisticas?.pct ?? 0}%`} />
              <Stat rotulo="Em dia" valor={`${estatisticas?.emDia ?? 0}`} />
              <Stat rotulo="Formados" valor={`${estatisticas?.totalFormados ?? 0}`} />
            </div>
            <p className="text-muted-foreground text-sm">
              “Em dia” = egresso com questionário atualizado nos últimos 12 meses.
            </p>
          </>
        )}
      </GestaoPage>
    </>
  )
}

GestaoDashboard.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
