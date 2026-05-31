import { Head, router } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Layers, SearchIcon } from 'lucide-react'
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
  CriarProgramaDialog,
  type InstitutoOption,
} from '~/components/admin/criar_programa_dialog'
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

const COLUNAS: ColumnDef<ProgramaRow>[] = [
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
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.nome}</span>
        {row.original.sigla && (
          <span className="text-muted-foreground text-xs">{row.original.sigla}</span>
        )}
      </div>
    ),
  },
  {
    id: 'modalidade',
    header: 'Modalidade',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.modalidade ? MODALIDADE_LABELS[row.original.modalidade] : '—'}
      </span>
    ),
  },
  {
    id: 'instituto',
    header: 'Instituto',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.institutoNome}{' '}
        <span className="text-muted-foreground text-xs">· {row.original.institutoCodigo}</span>
      </span>
    ),
  },
  {
    id: 'totalCursos',
    header: () => <span className="block text-end">Cursos</span>,
    cell: ({ row }) => (
      <div className="text-end tabular-nums">{row.original.totalCursos}</div>
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

export default function AdminProgramas({ programas, institutos, filtros }: PageProps) {
  const semInstitutos = institutos.length === 0
  const algumFiltro = !!(filtros.q || filtros.institutoId)
  const semDados =
    programas.data.length === 0 && !algumFiltro && programas.metadata.total === 0

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
          acoes={<CriarProgramaDialog institutos={institutos} />}
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
  algumFiltro,
}: {
  programas: { data: ProgramaRow[]; metadata: PaginatorMeta }
  filtros: Filtros
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
      columns={COLUNAS}
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
    <div className="flex flex-wrap items-center gap-2">
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

      <Select
        value={institutoValor}
        onValueChange={(v) => aplicar(busca, v ?? TODOS)}
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
        <Layers />
      </EmptyMedia>
      <EmptyContent>
        <EmptyTitle>Nenhum programa cadastrado.</EmptyTitle>
        <EmptyDescription>Use "Novo programa" para começar a montar o catálogo.</EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
