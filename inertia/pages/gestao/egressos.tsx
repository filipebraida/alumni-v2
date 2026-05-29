import { Head, usePage } from '@inertiajs/react'
import { type ReactElement } from 'react'
import { BellIcon, ChevronRightIcon, UploadIcon } from 'lucide-react'
import GestaoLayout from '~/layouts/gestao'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import { EgressosStats } from '~/components/gestao/egressos_stats'
import {
  EgressosTable,
  type EgressosResponse,
  type Situacao,
} from '~/components/gestao/egressos_table'
import { CadastrarEgressoDialog } from '~/components/gestao/cadastrar_egresso_dialog'
import { GestaoUserMenu } from '~/components/gestao/gestao_user_menu'
import { type InertiaProps } from '~/types'
import type { EgressosEstatisticas, GestaoShared } from '~/components/gestao/types'

type PageProps = InertiaProps<{
  egressos: EgressosResponse
  estatisticas: EgressosEstatisticas | null
  turmas: string[]
  q: string | null
  situacoes: Situacao[]
  turma: string | null
}>

export default function GestaoEgressos({
  egressos,
  estatisticas,
  turmas,
  q,
  situacoes,
  turma,
}: PageProps) {
  const { gestao } = usePage<{ gestao: GestaoShared }>().props
  const curso = gestao.cursos.find((c) => c.id === gestao.cursoAtivoId) ?? null

  return (
    <>
      <Head title="Gestão · Egressos" />

      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger />
        <nav className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <span>{curso?.nivel ?? 'Gestão'}</span>
          <ChevronRightIcon className="size-3.5 opacity-50" />
          <span className="font-medium text-foreground">Egressos</span>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            title="Em breve"
            aria-label="Notificações"
            className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
          >
            <BellIcon className="size-4.5" />
            <span className="absolute end-2 top-2 size-1.5 rounded-full bg-brand-yellow" />
          </button>
          <span className="h-5 w-px bg-border" />
          <GestaoUserMenu />
        </div>
      </header>

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
              totalCurso={estatisticas?.total ?? egressos.metadata.total}
            />
          </div>
        )}
      </div>
    </>
  )
}

GestaoEgressos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
