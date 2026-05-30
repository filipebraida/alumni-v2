import { Head, usePage } from '@inertiajs/react'
import { type ReactElement } from 'react'
import GestaoLayout from '~/layouts/gestao'
import { EgressosStats } from '~/components/gestao/egressos_stats'
import {
  EgressosTable,
  type DirecaoOrdenacao,
  type EgressosResponse,
  type OrdenarPor,
  type Situacao,
} from '~/components/gestao/egressos_table'
import { CadastrarEgressoDialog } from '~/components/gestao/cadastrar_egresso_dialog'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { ImportarEgressosDialog } from '~/components/gestao/importar_egressos_dialog'
import { type InertiaProps } from '~/types'
import type { EgressosEstatisticas, GestaoShared } from '~/components/gestao/types'

type PageProps = InertiaProps<{
  egressos: EgressosResponse
  estatisticas: EgressosEstatisticas | null
  turmas: string[]
  q: string | null
  situacoes: Situacao[]
  turma: string | null
  sort: OrdenarPor | null
  order: DirecaoOrdenacao | null
}>

export default function GestaoEgressos({
  egressos,
  estatisticas,
  turmas,
  q,
  situacoes,
  turma,
  sort,
  order,
}: PageProps) {
  const { gestao } = usePage<{ gestao: GestaoShared }>().props
  const curso = gestao.cursos.find((c) => c.id === gestao.cursoAtivoId) ?? null

  return (
    <>
      <Head title="Gestão · Egressos" />

      <GestaoPage>
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <>
            <GestaoPageHeader
              titulo={`Egressos de ${curso.nome}`}
              subtitulo={`${curso.nivel} · ${curso.instituto} — gestão da coordenação`}
              acoes={
                <>
                  <ImportarEgressosDialog cursoNome={curso.nome} />
                  <CadastrarEgressoDialog cursoNome={curso.nome} />
                </>
              }
            />

            {estatisticas && <EgressosStats estatisticas={estatisticas} />}

            <EgressosTable
              egressos={egressos}
              q={q}
              situacoes={situacoes}
              turma={turma}
              turmas={turmas}
              sort={sort}
              order={order}
            />
          </>
        )}
      </GestaoPage>
    </>
  )
}

GestaoEgressos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
