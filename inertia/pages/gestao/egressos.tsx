import { Head, usePage } from '@inertiajs/react'
import { ReactElement } from 'react'
import GestaoLayout from '~/layouts/gestao'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { EgressosTable, type EgressosResponse, type Situacao } from '~/components/gestao/egressos_table'
import { InertiaProps } from '~/types'
import type { GestaoShared } from '~/components/gestao/types'

type PageProps = InertiaProps<{
  egressos: EgressosResponse
  q: string | null
  situacoes: Situacao[]
}>

export default function GestaoEgressos({ egressos, q, situacoes }: PageProps) {
  const { gestao } = usePage<{ gestao: GestaoShared }>().props
  const curso = gestao.cursos.find((c) => c.id === gestao.cursoAtivoId) ?? null

  return (
    <>
      <Head title="Gestão · Egressos" />

      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <div className="leading-tight">
          <h1 className="font-semibold text-sm">Egressos</h1>
          <p className="text-muted-foreground text-xs">{curso?.nome ?? 'Nenhum curso'}</p>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground tabular-nums">
                {egressos.metadata.total}
              </span>{' '}
              {egressos.metadata.total === 1 ? 'egresso' : 'egressos'} no curso
            </p>
            <EgressosTable egressos={egressos} q={q} situacoes={situacoes} />
          </div>
        )}
      </div>
    </>
  )
}

GestaoEgressos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
