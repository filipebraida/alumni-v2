import { router } from '@inertiajs/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { EyeIcon, BellIcon, MailIcon, MoreHorizontalIcon, SearchIcon, XIcon } from 'lucide-react'

import { urlFor } from '~/client'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { DataTable } from '~/components/ui/data_table'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { toastManager } from '~/components/ui/toast'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { EgressosBulkBar } from '~/components/gestao/egressos_bulk_bar'

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
  cargo: string | null
  empregador: string | null
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

const SITUACAO_VARIANT: Record<Situacao, 'success' | 'info' | 'outline'> = {
  cursando: 'info',
  formado: 'success',
  evadido: 'outline',
}

const STATUS_LABEL: Record<StatusFrescor, string> = {
  em_dia: 'Em dia',
  desatualizado: 'Desatualizado',
  sem_registro: 'Sem registro',
}

const FRESCOR_DOT: Record<StatusFrescor, string> = {
  em_dia: 'bg-success',
  desatualizado: 'bg-warning',
  sem_registro: 'bg-muted-foreground/40',
}

const FILTROS_SITUACAO: { value: SituacaoFiltro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'formado', label: 'Formados' },
  { value: 'cursando', label: 'Cursando' },
]

const TODAS_TURMAS = 'todas'

function iniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .map((palavra) => palavra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatarData(iso: string | null) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

function escaparCsv(valor: string) {
  return /[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor
}

function exportarEgressosCsv(egressos: EgressoRow[]) {
  const cabecalho = [
    'Nome',
    'E-mail',
    'Matrícula',
    'Turma',
    'Situação',
    'Cargo',
    'Empregador',
    'Questionário',
  ]
  const linhas = egressos.map((egresso) => [
    egresso.nome,
    egresso.email ?? '',
    egresso.matriculaCodigo,
    egresso.periodoFormatura ?? '',
    SITUACAO_LABEL[egresso.situacao],
    egresso.cargo ?? '',
    egresso.empregador ?? '',
    egresso.ultimaAtualizacao ?? STATUS_LABEL[egresso.status],
  ])
  const conteudo = [cabecalho, ...linhas]
    .map((colunas) => colunas.map(escaparCsv).join(','))
    .join('\n')

  const blob = new Blob([`﻿${conteudo}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'egressos.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function SituacaoBadge({ situacao }: { situacao: Situacao }) {
  return (
    <Badge variant={SITUACAO_VARIANT[situacao]} className="gap-1.5">
      <span className="size-1.5 rounded-full bg-current" />
      {SITUACAO_LABEL[situacao]}
    </Badge>
  )
}

function AcoesEgresso({ egresso }: { egresso: EgressoRow }) {
  function copiarEmail() {
    if (!egresso.email) return
    navigator.clipboard
      ?.writeText(egresso.email)
      .then(() =>
        toastManager.add({
          type: 'success',
          title: 'E-mail copiado',
          description: egresso.email ?? undefined,
        })
      )
      .catch(() => {})
  }

  return (
    <div className="text-right">
      <Menu>
        <MenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={`Ações de ${egresso.nome}`} />}
        >
          <MoreHorizontalIcon />
        </MenuTrigger>
        <MenuPopup align="end" className="min-w-48">
          <MenuItem disabled>
            <EyeIcon /> Ver perfil
          </MenuItem>
          <MenuItem disabled={!egresso.email} onClick={copiarEmail}>
            <MailIcon /> Copiar e-mail
          </MenuItem>
          <MenuSeparator />
          <MenuItem disabled>
            <BellIcon /> Pedir atualização
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  )
}

const colunas: ColumnDef<EgressoRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Selecionar todos os egressos da página"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label={`Selecionar ${row.original.nome}`}
      />
    ),
  },
  {
    id: 'egresso',
    header: 'Egresso',
    cell: ({ row }) => {
      const egresso = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-muted font-semibold text-foreground text-xs">
              {iniciais(egresso.nome)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{egresso.nome}</div>
            {egresso.email && (
              <div className="truncate text-muted-foreground text-xs">{egresso.email}</div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: 'turma',
    header: 'Turma',
    cell: ({ row }) => (
      <div className="leading-tight">
        <div className="text-sm tabular-nums">{row.original.periodoFormatura ?? '—'}</div>
        <div className="font-mono text-muted-foreground text-xs">{row.original.matriculaCodigo}</div>
      </div>
    ),
  },
  {
    accessorKey: 'situacao',
    header: 'Situação',
    cell: ({ row }) => <SituacaoBadge situacao={row.original.situacao} />,
  },
  {
    id: 'vinculo',
    header: 'Vínculo atual',
    cell: ({ row }) => {
      const { cargo, empregador } = row.original
      if (!cargo && !empregador) {
        return <span className="text-muted-foreground/70 text-sm italic">não informado</span>
      }
      return (
        <div className="leading-tight">
          {cargo && <div className="font-medium text-sm">{cargo}</div>}
          {empregador && <div className="text-muted-foreground text-xs">{empregador}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Questionário',
    cell: ({ row }) => {
      const egresso = row.original
      return (
        <div className="flex items-center gap-2" title={STATUS_LABEL[egresso.status]}>
          <span className={cn('size-1.5 shrink-0 rounded-full', FRESCOR_DOT[egresso.status])} />
          {egresso.status === 'sem_registro' ? (
            <span className="text-muted-foreground text-sm italic">nunca respondeu</span>
          ) : (
            <span className="text-sm tabular-nums">{formatarData(egresso.ultimaAtualizacao)}</span>
          )}
        </div>
      )
    },
  },
  {
    id: 'acoes',
    header: '',
    cell: ({ row }) => <AcoesEgresso egresso={row.original} />,
  },
]

export function EgressosTable({
  egressos,
  q,
  situacoes,
  turma,
  turmas,
  totalCurso,
}: {
  egressos: EgressosResponse
  q: string | null
  situacoes: Situacao[]
  turma: string | null
  turmas: string[]
  totalCurso: number
}) {
  const [busca, setBusca] = useState(q ?? '')
  const [situacao, setSituacao] = useState<SituacaoFiltro>(
    situacoes[0] === 'formado' || situacoes[0] === 'cursando' ? situacoes[0] : 'todos'
  )
  const [turmaFiltro, setTurmaFiltro] = useState<string>(turma ?? TODAS_TURMAS)
  const [selecionados, setSelecionados] = useState<RowSelectionState>({})
  const perPage = egressos.metadata.perPage

  const aplicar = useCallback(
    (proxBusca: string, proxSituacao: SituacaoFiltro, proxTurma: string, itensPorPagina: number) => {
      router.get(
        urlFor('gestao.egressos'),
        {
          q: proxBusca.length > 0 ? proxBusca : undefined,
          situacoes: proxSituacao === 'todos' ? undefined : [proxSituacao],
          turma: proxTurma === TODAS_TURMAS ? undefined : proxTurma,
          perPage: itensPorPagina,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['egressos', 'q', 'situacoes', 'turma'],
        }
      )
    },
    []
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aplicarComDebounce = useCallback(
    (proxBusca: string, proxSituacao: SituacaoFiltro, proxTurma: string, itensPorPagina: number) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => aplicar(proxBusca, proxSituacao, proxTurma, itensPorPagina), 300)
    },
    [aplicar]
  )
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  // Seleção é por página (dados paginados no servidor): zera quando a página de
  // resultados muda, evitando ids selecionados que não estão mais visíveis.
  const idsVisiveis = egressos.data.map((egresso) => egresso.egressoId).join(',')
  useEffect(() => {
    setSelecionados({})
  }, [idsVisiveis])

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
          turma: turmaFiltro === TODAS_TURMAS ? undefined : turmaFiltro,
        },
        { preserveState: true, preserveScroll: true, replace: true }
      ),
  })

  const aoBuscar = (valor: string) => {
    setBusca(valor)
    aplicarComDebounce(valor, situacao, turmaFiltro, perPage)
  }

  const limparBusca = () => {
    setBusca('')
    if (timer.current) clearTimeout(timer.current)
    aplicar('', situacao, turmaFiltro, perPage)
  }

  const aoTrocarSituacao = (valor: SituacaoFiltro) => {
    setSituacao(valor)
    aplicar(busca, valor, turmaFiltro, perPage)
  }

  const aoTrocarTurma = (valor: string | null) => {
    const proximo = valor ?? TODAS_TURMAS
    setTurmaFiltro(proximo)
    aplicar(busca, situacao, proximo, perPage)
  }

  const egressosSelecionados = useMemo(
    () => egressos.data.filter((egresso) => selecionados[String(egresso.egressoId)]),
    [egressos.data, selecionados]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center gap-1 self-start rounded-lg border bg-background p-1">
          {FILTROS_SITUACAO.map((filtro) => (
            <button
              key={filtro.value}
              type="button"
              onClick={() => aoTrocarSituacao(filtro.value)}
              className={cn(
                'rounded-md px-3 py-1.5 font-medium text-sm transition-colors',
                situacao === filtro.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {filtro.label}
            </button>
          ))}
        </div>

        <InputGroup className="w-full sm:w-72">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            name="busca-egressos"
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
            placeholder="Buscar por nome, e-mail, matrícula…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-1p-ignore="true"
            data-lpignore="true"
            data-bwignore="true"
            data-form-type="other"
          />
          {busca.length > 0 && (
            <InputGroupAddon align="inline-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={limparBusca}
                aria-label="Limpar busca"
                className="text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <XIcon />
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>

        {turmas.length > 0 && (
          <Select value={turmaFiltro} onValueChange={aoTrocarTurma}>
            <SelectTrigger size="sm" className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TODAS_TURMAS}>Todas as turmas</SelectItem>
              {turmas.map((turmaOpcao) => (
                <SelectItem key={turmaOpcao} value={turmaOpcao}>
                  Turma {turmaOpcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="text-muted-foreground text-sm sm:ml-auto">
          <span className="font-medium text-foreground tabular-nums">{egressos.metadata.total}</span>{' '}
          de <span className="tabular-nums">{totalCurso}</span>
        </div>
      </div>

      <DataTable
        columns={colunas}
        data={egressos.data}
        remoteTableOptions={remoteTableOptions}
        rowSelection={selecionados}
        onRowSelectionChange={setSelecionados}
        getRowId={(egresso) => String(egresso.egressoId)}
        emptyMessage="Nenhum egresso encontrado."
      />

      <EgressosBulkBar
        quantidade={egressosSelecionados.length}
        onExportar={() => {
          exportarEgressosCsv(egressosSelecionados)
          toastManager.add({
            type: 'success',
            title: 'Exportação gerada',
            description: `${egressosSelecionados.length} egresso(s) em CSV.`,
          })
        }}
        onPedirAtualizacao={() =>
          toastManager.add({
            type: 'info',
            title: 'Em breve',
            description: 'O pedido de atualização do questionário ainda está sendo construído.',
          })
        }
        onLimpar={() => setSelecionados({})}
      />
    </div>
  )
}
