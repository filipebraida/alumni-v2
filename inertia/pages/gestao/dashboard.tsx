import { Head, usePage } from '@inertiajs/react'
import { type ReactElement } from 'react'
import GestaoLayout from '~/layouts/gestao'
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

      <div className="p-4 sm:p-6">
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="min-w-0">
              <h1 className="font-semibold text-2xl leading-tight tracking-tight">
                Visão geral de {curso.nome}
              </h1>
              <p className="mt-1 text-muted-foreground text-sm">
                {curso.nivel} · {curso.campus} — gestão da coordenação
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat rotulo="Cadastros em dia" valor={`${estatisticas?.pct ?? 0}%`} />
              <Stat rotulo="Em dia" valor={`${estatisticas?.emDia ?? 0}`} />
              <Stat rotulo="Formados" valor={`${estatisticas?.totalFormados ?? 0}`} />
            </div>
            <p className="text-muted-foreground text-sm">
              “Em dia” = egresso com questionário atualizado nos últimos 12 meses.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

GestaoDashboard.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
