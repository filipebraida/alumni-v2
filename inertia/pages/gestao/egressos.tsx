import { Head, usePage } from '@inertiajs/react'
import { type ReactElement } from 'react'
import { UploadIcon } from 'lucide-react'
import GestaoLayout from '~/layouts/gestao'
import { Button } from '~/components/ui/button'
import { EgressosStats } from '~/components/gestao/egressos_stats'
import {
  EgressosTable,
  type DirecaoOrdenacao,
  type EgressosResponse,
  type OrdenarPor,
  type Situacao,
} from '~/components/gestao/egressos_table'
import { CadastrarEgressoDialog } from '~/components/gestao/cadastrar_egresso_dialog'
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

      <div className="p-4 sm:p-6">
        {!curso ? (
          <p className="text-muted-foreground text-sm">
            Você ainda não gere nenhum curso. Fale com a coordenação para ser vinculado.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-semibold text-2xl leading-tight tracking-tight">
                  Egressos de {curso.nome}
                </h1>
                <p className="mt-1 text-muted-foreground text-sm">
                  {curso.nivel} · {curso.campus} — gestão da coordenação
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" disabled title="Em breve">
                  <UploadIcon /> Importar planilha
                </Button>
                <CadastrarEgressoDialog cursoNome={curso.nome} />
              </div>
            </div>

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
          </div>
        )}
      </div>
    </>
  )
}

GestaoEgressos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
