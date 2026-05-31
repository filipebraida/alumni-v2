import { Head, router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  EyeIcon,
  GraduationCap,
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
  CursoDialog,
  NovoCursoButton,
  type CursoEditavel,
  type InstitutoOption,
  type ProgramaOption,
} from '~/components/admin/curso_dialog'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { type InertiaProps } from '~/types'

type NivelAcademico = 'graduacao' | 'especializacao' | 'mba' | 'mestrado' | 'doutorado' | 'posdoc'

const NIVEL_LABELS: Record<NivelAcademico, string> = {
  graduacao: 'Graduação',
  especializacao: 'Especialização',
  mba: 'MBA',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
  posdoc: 'Pós-doutorado',
}

const TODOS = '_todos'

type CursoRow = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  programaId: number | null
  instituto: { id: number; nome: string; codigo: string }
}

type Filtros = {
  q: string | null
  nivel: NivelAcademico | null
  institutoId: number | null
}

type PageProps = InertiaProps<{
  cursos: { data: CursoRow[]; metadata: PaginatorMeta }
  institutos: InstitutoOption[]
  programas: ProgramaOption[]
  filtros: Filtros
}>

function montarColunas(
  institutos: InstitutoOption[],
  programas: ProgramaOption[]
): ColumnDef<CursoRow>[] {
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
        const curso = row.original
        return (
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground" title={curso.nome}>
              {curso.nome}
            </div>
            {/* xs: absorve código + nível + instituto + status */}
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:hidden">
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {curso.codigo}
              </span>
              <span className="text-muted-foreground text-xs">{NIVEL_LABELS[curso.nivel]}</span>
              <span className="text-muted-foreground text-xs">· {curso.instituto.codigo}</span>
              <Badge variant={curso.ativo ? 'success' : 'outline'}>
                {curso.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      id: 'nivel',
      header: 'Nível',
      meta: { responsiveClass: 'hidden sm:table-cell' },
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{NIVEL_LABELS[row.original.nivel]}</span>
      ),
    },
    {
      id: 'instituto',
      header: 'Instituto',
      meta: { responsiveClass: 'hidden md:table-cell' },
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.instituto.nome}{' '}
          <span className="text-muted-foreground text-xs">· {row.original.instituto.codigo}</span>
        </span>
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
    {
      id: 'acoes',
      header: '',
      cell: ({ row }) => (
        <AcoesCursoRow curso={row.original} institutos={institutos} programas={programas} />
      ),
    },
  ]
}

function AcoesCursoRow({
  curso,
  institutos,
  programas,
}: {
  curso: CursoRow
  institutos: InstitutoOption[]
  programas: ProgramaOption[]
}) {
  const [editando, setEditando] = useState(false)
  const [removendo, setRemovendo] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const editavel = useMemo<CursoEditavel>(
    () => ({
      id: curso.id,
      codigo: curso.codigo,
      nome: curso.nome,
      nivel: curso.nivel,
      institutoId: curso.instituto.id,
      programaId: curso.programaId ?? null,
      ativo: curso.ativo,
    }),
    [
      curso.id,
      curso.codigo,
      curso.nome,
      curso.nivel,
      curso.instituto.id,
      curso.programaId,
      curso.ativo,
    ]
  )

  function remover() {
    setExcluindo(true)
    router.delete(urlFor('admin.cursos.destroy', { id: curso.id }), {
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
          render={<Button variant="ghost" size="icon-sm" aria-label={`Ações de ${curso.nome}`} />}
        >
          <MoreHorizontalIcon />
        </MenuTrigger>
        <MenuPopup align="end" className="min-w-44">
          <MenuItem render={<Link href={urlFor('admin.cursos.show', { id: curso.id })} />}>
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

      <CursoDialog
        modo="editar"
        curso={editavel}
        institutos={institutos}
        programas={programas}
        open={editando}
        onOpenChange={setEditando}
      />

      <AlertDialog open={removendo} onOpenChange={setRemovendo}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {curso.nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Se o curso tiver matrículas ou coordenadores
              vinculados, a remoção será bloqueada.
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

export default function AdminCursos({ cursos, institutos, programas, filtros }: PageProps) {
  const semInstitutos = institutos.length === 0
  const algumFiltro = !!(filtros.q || filtros.nivel || filtros.institutoId)
  const semDados = cursos.data.length === 0 && !algumFiltro && cursos.metadata.total === 0
  const colunas = useMemo(() => montarColunas(institutos, programas), [institutos, programas])

  const subtitulo = semInstitutos
    ? 'Cadastre um instituto antes de criar cursos.'
    : 'Catálogo de cursos da UFRRJ. Cada curso pertence a um instituto.'

  return (
    <>
      <Head title="Administração · Cursos" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Cursos"
          subtitulo={subtitulo}
          acoes={<NovoCursoButton institutos={institutos} programas={programas} />}
        />

        {semDados ? (
          <EstadoVazio />
        ) : (
          <>
            <FiltrosBar
              institutos={institutos}
              filtros={filtros}
              perPage={cursos.metadata.perPage}
            />
            <CursosDataTable
              cursos={cursos}
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

AdminCursos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function CursosDataTable({
  cursos,
  filtros,
  colunas,
  algumFiltro,
}: {
  cursos: { data: CursoRow[]; metadata: PaginatorMeta }
  filtros: Filtros
  colunas: ColumnDef<CursoRow>[]
  algumFiltro: boolean
}) {
  const remoteTableOptions = useDataTable({
    data: cursos,
    visit: ({ page, perPage }) =>
      router.get(
        urlFor('admin.cursos'),
        {
          page,
          perPage,
          q: filtros.q ?? undefined,
          nivel: filtros.nivel ?? undefined,
          institutoId: filtros.institutoId ?? undefined,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['cursos', 'filtros'],
        }
      ),
  })

  return (
    <DataTable
      columns={colunas}
      data={cursos.data}
      remoteTableOptions={remoteTableOptions}
      paginationVariant="numbered"
      emptyMessage={algumFiltro ? 'Nenhum curso bate com os filtros.' : 'Nenhum curso cadastrado.'}
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
    (proxQ: string, proxNivel: string, proxInstituto: string) => {
      router.get(
        urlFor('admin.cursos'),
        {
          q: proxQ.length > 0 ? proxQ : undefined,
          nivel: proxNivel === TODOS ? undefined : proxNivel,
          institutoId: proxInstituto === TODOS ? undefined : Number(proxInstituto),
          perPage,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['cursos', 'filtros'],
        }
      )
    },
    [perPage]
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  const nivelValor = filtros.nivel ?? TODOS
  const institutoValor = filtros.institutoId?.toString() ?? TODOS
  const algumAtivo = !!(filtros.q || filtros.nivel || filtros.institutoId)

  function aoBuscar(valor: string) {
    setBusca(valor)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => aplicar(valor, nivelValor, institutoValor), 300)
  }

  function limpar() {
    setBusca('')
    aplicar('', TODOS, TODOS)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          name="busca-cursos"
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
          placeholder="Buscar por nome ou código…"
          autoComplete="off"
        />
      </InputGroup>

      <Select value={nivelValor} onValueChange={(v) => aplicar(busca, v ?? TODOS, institutoValor)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue>
            {(v) => (!v || v === TODOS ? 'Todos os níveis' : NIVEL_LABELS[v as NivelAcademico])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos os níveis</SelectItem>
          {(Object.keys(NIVEL_LABELS) as NivelAcademico[]).map((nivel) => (
            <SelectItem key={nivel} value={nivel}>
              {NIVEL_LABELS[nivel]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={institutoValor} onValueChange={(v) => aplicar(busca, nivelValor, v ?? TODOS)}>
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
        <GraduationCap />
      </EmptyMedia>
      <EmptyContent>
        <EmptyTitle>Nenhum curso cadastrado.</EmptyTitle>
        <EmptyDescription>
          Use &ldquo;Novo curso&rdquo; para começar a montar o catálogo.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
