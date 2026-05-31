import { Head, router } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Building2, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data_table'
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input_group'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { CriarInstitutoDialog } from '~/components/admin/criar_instituto_dialog'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { type InertiaProps } from '~/types'

type InstitutoRow = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
}

type Filtros = { q: string | null }

type PageProps = InertiaProps<{
  institutos: { data: InstitutoRow[]; metadata: PaginatorMeta }
  filtros: Filtros
}>

const COLUNAS: ColumnDef<InstitutoRow>[] = [
  {
    id: 'codigo',
    header: 'Código',
    meta: { responsiveClass: 'hidden sm:table-cell' },
    cell: ({ row }) => (
      <span className="font-mono text-xs uppercase tracking-wide">{row.original.codigo}</span>
    ),
  },
  {
    id: 'nome',
    header: 'Nome',
    meta: { cellClass: 'max-w-0 w-full' },
    cell: ({ row }) => {
      const instituto = row.original
      return (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground" title={instituto.nome}>
            {instituto.nome}
          </div>
          {/* xs: absorve código + cursos + status */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:hidden">
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
              {instituto.codigo}
            </span>
            <span className="text-muted-foreground text-xs tabular-nums">
              {instituto.totalCursos} curso{instituto.totalCursos === 1 ? '' : 's'}
            </span>
            <Badge variant={instituto.ativo ? 'success' : 'outline'}>
              {instituto.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      )
    },
  },
  {
    id: 'totalCursos',
    meta: { responsiveClass: 'hidden md:table-cell' },
    header: () => <span className="block text-end">Cursos</span>,
    cell: ({ row }) => (
      <div className="text-end tabular-nums">{row.original.totalCursos}</div>
    ),
  },
  {
    id: 'ativo',
    header: 'Status',
    meta: { responsiveClass: 'hidden sm:table-cell' },
    cell: ({ row }) => (
      <Badge variant={row.original.ativo ? 'success' : 'outline'}>
        {row.original.ativo ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
]

export default function AdminInstitutos({ institutos, filtros }: PageProps) {
  const algumFiltro = !!filtros.q
  const semDados = institutos.data.length === 0 && !algumFiltro && institutos.metadata.total === 0

  return (
    <>
      <Head title="Administração · Institutos" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Institutos"
          subtitulo="Unidades da UFRRJ. Cada curso pertence a um instituto."
          acoes={<CriarInstitutoDialog />}
        />

        {semDados ? (
          <EstadoVazio />
        ) : (
          <>
            <FiltrosBar filtros={filtros} perPage={institutos.metadata.perPage} />
            <InstitutosDataTable institutos={institutos} filtros={filtros} algumFiltro={algumFiltro} />
          </>
        )}
      </GestaoPage>
    </>
  )
}

AdminInstitutos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function InstitutosDataTable({
  institutos,
  filtros,
  algumFiltro,
}: {
  institutos: { data: InstitutoRow[]; metadata: PaginatorMeta }
  filtros: Filtros
  algumFiltro: boolean
}) {
  const remoteTableOptions = useDataTable({
    data: institutos,
    visit: ({ page, perPage }) =>
      router.get(
        urlFor('admin.institutos'),
        {
          page,
          perPage,
          q: filtros.q ?? undefined,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['institutos', 'filtros'],
        }
      ),
  })

  return (
    <DataTable
      columns={COLUNAS}
      data={institutos.data}
      remoteTableOptions={remoteTableOptions}
      paginationVariant="numbered"
      emptyMessage={
        algumFiltro ? 'Nenhum instituto bate com a busca.' : 'Nenhum instituto cadastrado.'
      }
    />
  )
}

function FiltrosBar({ filtros, perPage }: { filtros: Filtros; perPage: number }) {
  const [busca, setBusca] = useState(filtros.q ?? '')

  const aplicar = useCallback(
    (proxQ: string) => {
      router.get(
        urlFor('admin.institutos'),
        { q: proxQ.length > 0 ? proxQ : undefined, perPage },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['institutos', 'filtros'],
        }
      )
    },
    [perPage]
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  function aoBuscar(valor: string) {
    setBusca(valor)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => aplicar(valor), 300)
  }

  function limpar() {
    setBusca('')
    aplicar('')
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          name="busca-institutos"
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
          placeholder="Buscar por nome ou código…"
          autoComplete="off"
        />
      </InputGroup>
      {!!filtros.q && (
        <Button variant="ghost" size="sm" onClick={limpar}>
          Limpar
        </Button>
      )}
    </div>
  )
}

function EstadoVazio() {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <Building2 />
      </EmptyMedia>
      <EmptyContent>
        <EmptyTitle>Nenhum instituto cadastrado.</EmptyTitle>
        <EmptyDescription>Use "Novo instituto" para começar a montar o catálogo.</EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

