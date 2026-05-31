import { Head, router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  EyeIcon,
  Layers,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import {
  NovoProgramaButton,
  ProgramaDialog,
  type InstitutoOption,
  type ProgramaEditavel,
} from '~/components/admin/programa_dialog'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { type InertiaProps } from '~/types'

type Modalidade = 'academico' | 'profissional'

const MODALIDADE_LABELS: Record<Modalidade, string> = {
  academico: 'Acadêmico',
  profissional: 'Profissional',
}

const TODOS = '_todos'

type ProgramaRow = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: Modalidade | null
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  totalCursos: number
}

type Filtros = {
  q: string | null
  institutoId: number | null
}

type PageProps = InertiaProps<{
  programas: { data: ProgramaRow[]; metadata: PaginatorMeta }
  institutos: InstitutoOption[]
  filtros: Filtros
}>

function montarColunas(institutos: InstitutoOption[]): ColumnDef<ProgramaRow>[] {
  return [
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
        const programa = row.original
        return (
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground" title={programa.nome}>
              {programa.nome}
            </div>
            {programa.sigla && (
              <div className="truncate text-muted-foreground text-xs">{programa.sigla}</div>
            )}
            {/* xs: absorve código + modalidade + instituto + cursos + status */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:hidden">
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {programa.codigo}
              </span>
              {programa.modalidade && (
                <span className="text-muted-foreground text-xs">
                  {MODALIDADE_LABELS[programa.modalidade]}
                </span>
              )}
              <span className="text-muted-foreground text-xs">· {programa.institutoCodigo}</span>
              <span className="text-muted-foreground text-xs tabular-nums">
                {programa.totalCursos} curso{programa.totalCursos === 1 ? '' : 's'}
              </span>
              <Badge variant={programa.ativo ? 'success' : 'outline'}>
                {programa.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      id: 'modalidade',
      header: 'Modalidade',
      meta: { responsiveClass: 'hidden md:table-cell' },
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.modalidade ? MODALIDADE_LABELS[row.original.modalidade] : '—'}
        </span>
      ),
    },
    {
      id: 'instituto',
      header: 'Instituto',
      meta: { responsiveClass: 'hidden lg:table-cell' },
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.institutoNome}{' '}
          <span className="text-muted-foreground text-xs">· {row.original.institutoCodigo}</span>
        </span>
      ),
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
      cell: ({ row }) => <AcoesProgramaRow programa={row.original} institutos={institutos} />,
    },
  ]
}

function AcoesProgramaRow({
  programa,
  institutos,
}: {
  programa: ProgramaRow
  institutos: InstitutoOption[]
}) {
  const [editando, setEditando] = useState(false)
  const [removendo, setRemovendo] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const editavel = useMemo<ProgramaEditavel>(
    () => ({
      id: programa.id,
      codigo: programa.codigo,
      nome: programa.nome,
      sigla: programa.sigla,
      modalidade: programa.modalidade,
      institutoId: programa.institutoId,
      ativo: programa.ativo,
    }),
    [
      programa.id,
      programa.codigo,
      programa.nome,
      programa.sigla,
      programa.modalidade,
      programa.institutoId,
      programa.ativo,
    ]
  )

  function remover() {
    setExcluindo(true)
    router.delete(urlFor('admin.programas.destroy', { id: programa.id }), {
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
            <Button variant="ghost" size="icon-sm" aria-label={`Ações de ${programa.nome}`} />
          }
        >
          <MoreHorizontalIcon />
        </MenuTrigger>
        <MenuPopup align="end" className="min-w-44">
          <MenuItem render={<Link href={urlFor('admin.programas.show', { id: programa.id })} />}>
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

      <ProgramaDialog
        modo="editar"
        programa={editavel}
        institutos={institutos}
        open={editando}
        onOpenChange={setEditando}
      />

      <AlertDialog open={removendo} onOpenChange={setRemovendo}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {programa.nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Se o programa tiver cursos vinculados, a remoção será
              bloqueada — remova-os antes.
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

export default function AdminProgramas({ programas, institutos, filtros }: PageProps) {
  const semInstitutos = institutos.length === 0
  const algumFiltro = !!(filtros.q || filtros.institutoId)
  const semDados = programas.data.length === 0 && !algumFiltro && programas.metadata.total === 0
  const colunas = useMemo(() => montarColunas(institutos), [institutos])

  const subtitulo = semInstitutos
    ? 'Cadastre um instituto antes de criar programas.'
    : 'Programas de Pós-Graduação. Cada PPG agrupa um ou mais cursos (mestrado, doutorado).'

  return (
    <>
      <Head title="Administração · Programas" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Programas"
          subtitulo={subtitulo}
          acoes={<NovoProgramaButton institutos={institutos} />}
        />

        {semDados ? (
          <EstadoVazio />
        ) : (
          <>
            <FiltrosBar
              institutos={institutos}
              filtros={filtros}
              perPage={programas.metadata.perPage}
            />
            <ProgramasDataTable
              programas={programas}
              filtros={filtros}
              colunas={colunas}
              algumFiltro={algumFiltro}
            />
          </>
        )}
      </GestaoPage>
    </>
  )
}

AdminProgramas.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function ProgramasDataTable({
  programas,
  filtros,
  colunas,
  algumFiltro,
}: {
  programas: { data: ProgramaRow[]; metadata: PaginatorMeta }
  filtros: Filtros
  colunas: ColumnDef<ProgramaRow>[]
  algumFiltro: boolean
}) {
  const remoteTableOptions = useDataTable({
    data: programas,
    visit: ({ page, perPage }) =>
      router.get(
        urlFor('admin.programas'),
        {
          page,
          perPage,
          q: filtros.q ?? undefined,
          institutoId: filtros.institutoId ?? undefined,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['programas', 'filtros'],
        }
      ),
  })

  return (
    <DataTable
      columns={colunas}
      data={programas.data}
      remoteTableOptions={remoteTableOptions}
      paginationVariant="numbered"
      emptyMessage={
        algumFiltro ? 'Nenhum programa bate com os filtros.' : 'Nenhum programa cadastrado.'
      }
    />
  )
}

function FiltrosBar({
  institutos,
  filtros,
  perPage,
}: {
  institutos: InstitutoOption[]
  filtros: Filtros
  perPage: number
}) {
  const [busca, setBusca] = useState(filtros.q ?? '')

  const aplicar = useCallback(
    (proxQ: string, proxInstituto: string) => {
      router.get(
        urlFor('admin.programas'),
        {
          q: proxQ.length > 0 ? proxQ : undefined,
          institutoId: proxInstituto === TODOS ? undefined : Number(proxInstituto),
          perPage,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['programas', 'filtros'],
        }
      )
    },
    [perPage]
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  const institutoValor = filtros.institutoId?.toString() ?? TODOS
  const algumAtivo = !!(filtros.q || filtros.institutoId)

  function aoBuscar(valor: string) {
    setBusca(valor)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => aplicar(valor, institutoValor), 300)
  }

  function limpar() {
    setBusca('')
    aplicar('', TODOS)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          name="busca-programas"
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
          placeholder="Buscar por nome, código ou sigla…"
          autoComplete="off"
        />
      </InputGroup>

      <Select value={institutoValor} onValueChange={(v) => aplicar(busca, v ?? TODOS)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue>
            {(v) =>
              !v || v === TODOS
                ? 'Todos os institutos'
                : (institutos.find((i) => i.id.toString() === v)?.nome ?? '—')
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos os institutos</SelectItem>
          {institutos.map((instituto) => (
            <SelectItem key={instituto.id} value={instituto.id.toString()}>
              {instituto.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {algumAtivo && (
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
        <Layers />
      </EmptyMedia>
      <EmptyContent>
        <EmptyTitle>Nenhum programa cadastrado.</EmptyTitle>
        <EmptyDescription>
          Use &ldquo;Novo programa&rdquo; para começar a montar o catálogo.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
