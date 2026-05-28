import { router } from '@inertiajs/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'

import { urlFor } from '~/client'
import { DataTable } from '~/components/ui/data_table'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'

export type Situacao = 'cursando' | 'formado' | 'evadido'
export type StatusFrescor = 'em_dia' | 'desatualizado' | 'sem_registro'

export type EgressoRow = {
  egressoId: number
  nome: string
  email: string | null
  matriculaCodigo: string
  situacao: Situacao
  periodoFormatura: string | null
  consentiu: boolean
  ultimaAtualizacao: string | null
  status: StatusFrescor
}

export type EgressosResponse = {
  data: EgressoRow[]
  metadata: PaginatorMeta
}

type SituacaoFiltro = 'todos' | 'formado' | 'cursando'

const SITUACAO_LABEL: Record<Situacao, string> = {
  cursando: 'Cursando',
  formado: 'Formado',
  evadido: 'Evadido',
}

const SITUACAO_VARIANT: Record<Situacao, 'info' | 'secondary' | 'outline'> = {
  cursando: 'info',
  formado: 'secondary',
  evadido: 'outline',
}

const STATUS_LABEL: Record<StatusFrescor, string> = {
  em_dia: 'Em dia',
  desatualizado: 'Desatualizado',
  sem_registro: 'Sem registro',
}

const STATUS_VARIANT: Record<StatusFrescor, 'success' | 'warning' | 'outline'> = {
  em_dia: 'success',
  desatualizado: 'warning',
  sem_registro: 'outline',
}

const FILTROS_SITUACAO: { value: SituacaoFiltro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'formado', label: 'Formados' },
  { value: 'cursando', label: 'Cursando' },
]

function formatarData(iso: string | null) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

const colunas: ColumnDef<EgressoRow>[] = [
  {
    id: 'egresso',
    header: 'Egresso',
    cell: ({ row }) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{row.original.nome}</div>
        {row.original.email && (
          <div className="truncate text-muted-foreground text-xs">{row.original.email}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'matriculaCodigo',
    header: 'Matrícula',
    cell: ({ row }) => (
      <div className="leading-tight">
        <div className="font-mono text-xs">{row.original.matriculaCodigo}</div>
        {row.original.periodoFormatura && (
          <div className="text-muted-foreground text-xs">{row.original.periodoFormatura}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'situacao',
    header: 'Situação',
    cell: ({ row }) => (
      <Badge variant={SITUACAO_VARIANT[row.original.situacao]}>
        {SITUACAO_LABEL[row.original.situacao]}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Atualização',
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status]}>
        {STATUS_LABEL[row.original.status]}
      </Badge>
    ),
  },
  {
    accessorKey: 'ultimaAtualizacao',
    header: 'Última atualização',
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatarData(row.original.ultimaAtualizacao)}
      </span>
    ),
  },
]

export function EgressosTable({
  egressos,
  q,
  situacoes,
}: {
  egressos: EgressosResponse
  q: string | null
  situacoes: Situacao[]
}) {
  const [busca, setBusca] = useState(q ?? '')
  const [situacao, setSituacao] = useState<SituacaoFiltro>(
    situacoes[0] === 'formado' || situacoes[0] === 'cursando' ? situacoes[0] : 'todos'
  )
  const perPage = egressos.metadata.perPage

  const aplicar = useCallback(
    (proxBusca: string, proxSituacao: SituacaoFiltro, itensPorPagina: number) => {
      router.get(
        urlFor('gestao.egressos'),
        {
          q: proxBusca.length > 0 ? proxBusca : undefined,
          situacoes: proxSituacao === 'todos' ? undefined : [proxSituacao],
          perPage: itensPorPagina,
        },
        { preserveState: true, preserveScroll: true, replace: true, only: ['egressos', 'q', 'situacoes'] }
      )
    },
    []
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aplicarComDebounce = useCallback(
    (proxBusca: string, proxSituacao: SituacaoFiltro, itensPorPagina: number) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => aplicar(proxBusca, proxSituacao, itensPorPagina), 300)
    },
    [aplicar]
  )
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  const remoteTableOptions = useDataTable({
    data: egressos,
    visit: ({ page, perPage: itensPorPagina }) =>
      router.get(
        urlFor('gestao.egressos'),
        {
          page,
          perPage: itensPorPagina,
          q: busca.length > 0 ? busca : undefined,
          situacoes: situacao === 'todos' ? undefined : [situacao],
        },
        { preserveState: true, preserveScroll: true, replace: true }
      ),
  })

  const aoBuscar = (valor: string) => {
    setBusca(valor)
    aplicarComDebounce(valor, situacao, perPage)
  }

  const aoTrocarSituacao = (valor: SituacaoFiltro) => {
    setSituacao(valor)
    aplicar(busca, valor, perPage)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTROS_SITUACAO.map((filtro) => (
            <Button
              key={filtro.value}
              type="button"
              size="sm"
              variant={situacao === filtro.value ? 'default' : 'outline'}
              onClick={() => aoTrocarSituacao(filtro.value)}
            >
              {filtro.label}
            </Button>
          ))}
        </div>
        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
            placeholder="Buscar por nome, e-mail, matrícula…"
          />
        </InputGroup>
      </div>

      <DataTable
        columns={colunas}
        data={egressos.data}
        remoteTableOptions={remoteTableOptions}
        emptyMessage="Nenhum egresso encontrado."
      />
    </div>
  )
}
