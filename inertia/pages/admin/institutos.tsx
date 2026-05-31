import { Head, router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Building2,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  SearchIcon,
  TrashIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '~/components/ui/alert_dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data_table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input_group'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import {
  InstitutoDialog,
  NovoInstitutoButton,
  type InstitutoEditavel,
} from '~/components/admin/instituto_dialog'
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
    cell: ({ row }) => <div className="text-end tabular-nums">{row.original.totalCursos}</div>,
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
  {
    id: 'acoes',
    header: '',
    cell: ({ row }) => <AcoesInstitutoRow instituto={row.original} />,
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
          acoes={<NovoInstitutoButton />}
        />

        {semDados ? (
          <EstadoVazio />
        ) : (
          <>
            <FiltrosBar filtros={filtros} perPage={institutos.metadata.perPage} />
            <InstitutosDataTable
              institutos={institutos}
              filtros={filtros}
              algumFiltro={algumFiltro}
            />
          </>
        )}
      </GestaoPage>
    </>
  )
}

AdminInstitutos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function AcoesInstitutoRow({ instituto }: { instituto: InstitutoRow }) {
  const [editando, setEditando] = useState(false)
  const [removendo, setRemovendo] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const editavel = useMemo<InstitutoEditavel>(
    () => ({
      id: instituto.id,
      codigo: instituto.codigo,
      nome: instituto.nome,
      ativo: instituto.ativo,
    }),
    [instituto.id, instituto.codigo, instituto.nome, instituto.ativo]
  )

  function remover() {
    setExcluindo(true)
    router.delete(urlFor('admin.institutos.destroy', { id: instituto.id }), {
      preserveScroll: true,
      onFinish: () => {
        setExcluindo(false)
        setRemovendo(false)
      },
    })
  }

  return (
    <div className="text-right">
      <Menu>
        <MenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`Ações de ${instituto.nome}`} />
          }
        >
          <MoreHorizontalIcon />
        </MenuTrigger>
        <MenuPopup align="end" className="min-w-44">
          <MenuItem render={<Link href={urlFor('admin.institutos.show', { id: instituto.id })} />}>
            <EyeIcon /> Ver
          </MenuItem>
          <MenuItem onClick={() => setEditando(true)}>
            <PencilIcon /> Editar
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            onClick={() => setRemovendo(true)}
            className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
          >
            <TrashIcon /> Remover
          </MenuItem>
        </MenuPopup>
      </Menu>

      <InstitutoDialog
        modo="editar"
        instituto={editavel}
        open={editando}
        onOpenChange={setEditando}
      />

      <AlertDialog open={removendo} onOpenChange={setRemovendo}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {instituto.nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Se o instituto tiver cursos ou programas vinculados,
              a remoção será bloqueada — remova-os antes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </AlertDialogClose>
            <Button variant="destructive" onClick={remover} disabled={excluindo}>
              {excluindo ? 'Removendo…' : 'Remover'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  )
}

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
        <EmptyDescription>
          Use &ldquo;Novo instituto&rdquo; para começar a montar o catálogo.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
