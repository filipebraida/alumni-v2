import { Head, router } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { GraduationCap, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data_table'
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input_group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import {
  CriarCursoDialog,
  type InstitutoOption,
  type ProgramaOption,
} from '~/components/admin/criar_curso_dialog'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { type InertiaProps } from '~/types'

type NivelAcademico =
  | 'graduacao'
  | 'especializacao'
  | 'mba'
  | 'mestrado'
  | 'doutorado'
  | 'posdoc'

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

const COLUNAS: ColumnDef<CursoRow>[] = [
  {
    id: 'codigo',
    header: 'Código',
    cell: ({ row }) => (
      <span className="font-mono text-xs uppercase tracking-wide">{row.original.codigo}</span>
    ),
  },
  {
    id: 'nome',
    header: 'Nome',
    cell: ({ row }) => <span className="font-medium">{row.original.nome}</span>,
  },
  {
    id: 'nivel',
    header: 'Nível',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{NIVEL_LABELS[row.original.nivel]}</span>
    ),
  },
  {
    id: 'instituto',
    header: 'Instituto',
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
    cell: ({ row }) => (
      <Badge variant={row.original.ativo ? 'success' : 'outline'}>
        {row.original.ativo ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
]

export default function AdminCursos({ cursos, institutos, programas, filtros }: PageProps) {
  const semInstitutos = institutos.length === 0
  const algumFiltro = !!(filtros.q || filtros.nivel || filtros.institutoId)
  const semDados = cursos.data.length === 0 && !algumFiltro && cursos.metadata.total === 0

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
          acoes={<CriarCursoDialog institutos={institutos} programas={programas} />}
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
            <CursosDataTable cursos={cursos} filtros={filtros} algumFiltro={algumFiltro} />
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
  algumFiltro,
}: {
  cursos: { data: CursoRow[]; metadata: PaginatorMeta }
  filtros: Filtros
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
      columns={COLUNAS}
      data={cursos.data}
      remoteTableOptions={remoteTableOptions}
      paginationVariant="numbered"
      emptyMessage={
        algumFiltro ? 'Nenhum curso bate com os filtros.' : 'Nenhum curso cadastrado.'
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
    <div className="flex flex-wrap items-center gap-2">
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

      <Select
        value={nivelValor}
        onValueChange={(v) => aplicar(busca, v ?? TODOS, institutoValor)}
      >
        <SelectTrigger className="w-44">
          <SelectValue>
            {(v) =>
              !v || v === TODOS ? 'Todos os níveis' : NIVEL_LABELS[v as NivelAcademico]
            }
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

      <Select
        value={institutoValor}
        onValueChange={(v) => aplicar(busca, nivelValor, v ?? TODOS)}
      >
        <SelectTrigger className="w-48">
          <SelectValue>
            {(v) =>
              !v || v === TODOS
                ? 'Todos os institutos'
                : institutos.find((i) => i.id.toString() === v)?.nome ?? '—'
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
        <EmptyDescription>Use "Novo curso" para começar a montar o catálogo.</EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
