'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Tailwind classes aplicadas tanto ao header quanto às cells da coluna.
     * Use breakpoints (ex.: `hidden md:table-cell`) para esconder a coluna em
     * larguras menores sem mexer no DOM.
     */
    responsiveClass?: string
    /**
     * Tailwind classes aplicadas apenas às `<td>` da coluna (não ao header).
     * Use `'max-w-0 w-full'` na coluna "Nome" pra ela pegar o espaço restante
     * da linha e truncar quando o conteúdo passar — sem `max-w` fixo deixando
     * espaço sobrando à direita.
     */
    cellClass?: string
  }
}
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { useState } from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

/**
 * Opções de paginação server-driven (vindas do hook useDataTable). Quando
 * ausente, a tabela pagina e filtra no cliente (tanstack row models).
 */
export interface RemoteTableOptions {
  pageCount: number
  total: number
  state: { pagination: PaginationState }
  onPaginationChange: OnChangeFn<PaginationState>
}

type PaginationVariant = 'simple' | 'numbered'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  emptyMessage?: string
  pageSizeOptions?: number[]
  remoteTableOptions?: RemoteTableOptions
  /** Seleção de linhas (opt-in): controle no componente pai. */
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  getRowId?: (row: TData, index: number) => string
  /** Ordenação (opt-in). Em modo remote a ordenação é resolvida no servidor. */
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  /** Variante visual da paginação. 'numbered' inclui números + ellipsis. */
  paginationVariant?: PaginationVariant
}

/** Calcula a lista de páginas a exibir, com ellipsis nas pontas se necessário. */
function paginas(atual: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | 'ellipsis')[] = [1]
  const lo = Math.max(2, atual - 1)
  const hi = Math.min(total - 1, atual + 1)
  if (lo > 2) out.push('ellipsis')
  for (let i = lo; i <= hi; i++) out.push(i)
  if (hi < total - 1) out.push('ellipsis')
  out.push(total)
  return out
}

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = 'Nenhum resultado.',
  pageSizeOptions = [10, 20, 30, 50],
  remoteTableOptions,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  sorting,
  onSortingChange,
  paginationVariant = 'simple',
}: DataTableProps<TData, TValue>) {
  const remote = !!remoteTableOptions
  const selectable = !!onRowSelectionChange
  const sortable = !!onSortingChange
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // eslint-disable-next-line react-hooks/incompatible-library -- @tanstack/react-table not yet compiler-compatible
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    manualPagination: remote,
    manualFiltering: remote,
    manualSorting: sortable && remote,
    enableRowSelection: selectable,
    enableSorting: sortable,
    pageCount: remote ? remoteTableOptions.pageCount : undefined,
    state: {
      pagination: remote ? remoteTableOptions.state.pagination : localPagination,
      columnFilters: remote ? undefined : columnFilters,
      ...(selectable ? { rowSelection } : {}),
      ...(sortable ? { sorting } : {}),
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange,
    onSortingChange,
    onPaginationChange: remote ? remoteTableOptions.onPaginationChange : setLocalPagination,
    ...(remote ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    ...(sortable && !remote ? { getSortedRowModel: getSortedRowModel() } : {}),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalFiltrado = remote ? remoteTableOptions.total : table.getFilteredRowModel().rows.length
  const totalPaginas = Math.max(table.getPageCount(), 1)
  const paginaAtual = pageIndex + 1
  const inicio = totalFiltrado === 0 ? 0 : pageIndex * pageSize + 1
  const fim = Math.min((pageIndex + 1) * pageSize, totalFiltrado)

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((grupo) => (
              <TableRow key={grupo.id} className="bg-muted/40 hover:bg-muted/40">
                {grupo.headers.map((header) => {
                  const sortOrdem = header.column.getIsSorted()
                  const podeSortar = header.column.getCanSort()
                  const conteudo = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'font-medium text-muted-foreground text-xs uppercase tracking-wider',
                        header.column.columnDef.meta?.responsiveClass
                      )}
                    >
                      {!header.isPlaceholder && podeSortar ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className={cn(
                            'group inline-flex items-center gap-1.5 transition-colors hover:text-foreground',
                            sortOrdem && 'text-foreground'
                          )}
                        >
                          {conteudo}
                          <span className="flex flex-col leading-none">
                            <ChevronUpIcon
                              className={cn(
                                '-mb-0.5 size-3 transition-opacity',
                                sortOrdem === 'asc'
                                  ? 'opacity-100'
                                  : 'opacity-25 group-hover:opacity-50'
                              )}
                            />
                            <ChevronDownIcon
                              className={cn(
                                'size-3 transition-opacity',
                                sortOrdem === 'desc'
                                  ? 'opacity-100'
                                  : 'opacity-25 group-hover:opacity-50'
                              )}
                            />
                          </span>
                        </button>
                      ) : (
                        conteudo
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.responsiveClass,
                        cell.column.columnDef.meta?.cellClass
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {paginationVariant === 'numbered' && (
          <div className="flex flex-wrap items-center gap-3 border-t bg-muted/24 px-4 py-3">
            {/* Esquerda — escondida em xs; sm+ mostra "Linhas por página";
                md+ adiciona o "Mostrando X–Y de Z". */}
            <div className="hidden flex-wrap items-center gap-3 sm:flex">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Linhas por página</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(valor) => valor && table.setPageSize(Number(valor))}
                >
                  <SelectTrigger size="sm" className="w-[4.5rem] min-w-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((opcao) => (
                      <SelectItem key={opcao} value={String(opcao)}>
                        {opcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {totalFiltrado > 0 && (
                <div className="hidden text-muted-foreground text-sm md:block">
                  Mostrando{' '}
                  <span className="font-medium text-foreground tabular-nums">
                    {inicio}–{fim}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-foreground tabular-nums">{totalFiltrado}</span>
                </div>
              )}
            </div>

            {/* Direita — sempre puxada com ms-auto. xs: prev + "atual / total"
                + next. sm+: troca o indicador por páginas numeradas. md+:
                adiciona primeira/última. */}
            <div className="ms-auto flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                className="hidden md:inline-flex"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Primeira página"
              >
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Página anterior"
              >
                <ChevronLeftIcon />
              </Button>

              <div className="hidden items-center gap-1 sm:flex">
                {paginas(paginaAtual, totalPaginas).map((item, indice) =>
                  item === 'ellipsis' ? (
                    <span
                      key={`gap-${indice}`}
                      className="px-1.5 text-muted-foreground text-sm"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => table.setPageIndex(item - 1)}
                      aria-current={item === paginaAtual ? 'page' : undefined}
                      className={cn(
                        'grid h-8 min-w-8 place-items-center rounded-md px-2 font-medium text-sm tabular-nums transition-colors',
                        item === paginaAtual
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <span
                className="px-2 text-muted-foreground text-sm tabular-nums sm:hidden"
                aria-label={`Página ${paginaAtual} de ${totalPaginas}`}
              >
                {paginaAtual} / {totalPaginas}
              </span>

              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Próxima página"
              >
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="hidden md:inline-flex"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Última página"
              >
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        )}
      </div>

      {paginationVariant === 'simple' && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Por página</span>
            <Select
              value={String(pageSize)}
              onValueChange={(valor) => valor && table.setPageSize(Number(valor))}
            >
              <SelectTrigger size="sm" className="w-[4.5rem] min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opcao) => (
                  <SelectItem key={opcao} value={String(opcao)}>
                    {opcao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-sm">
              Página <span className="font-medium text-foreground tabular-nums">{paginaAtual}</span>{' '}
              de <span className="font-medium text-foreground tabular-nums">{totalPaginas}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Primeira página"
              >
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Página anterior"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Próxima página"
              >
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Última página"
              >
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
