import type { PaginationState, Updater } from '@tanstack/react-table'
import type { RemoteTableOptions } from '~/components/ui/data_table'

/** Metadados de paginação do Lucid (`paginator.getMeta()`). */
export type PaginatorMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export type VisitFn = (args: { page: number; perPage: number }) => void

/**
 * Converte os metadados do paginador do backend em `RemoteTableOptions` para o
 * DataTable. Mudar de página (ou de itens por página) chama `visit`, que faz o
 * `router.get` com os parâmetros — paginação server-driven.
 */
export function useDataTable({
  data,
  visit,
}: {
  data: { metadata: PaginatorMeta }
  visit: VisitFn
}): RemoteTableOptions {
  const pageIndex = Math.max(0, (data.metadata.currentPage ?? 1) - 1)
  const pageSize = data.metadata.perPage
  const pageCount = Math.max(1, data.metadata.lastPage)
  const total = data.metadata.total

  return {
    pageCount,
    total,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const atual: PaginationState = { pageIndex, pageSize }
      const proximo = typeof updater === 'function' ? updater(atual) : updater

      if (proximo.pageSize !== atual.pageSize) {
        visit({ page: 1, perPage: proximo.pageSize })
        return
      }
      visit({ page: proximo.pageIndex + 1, perPage: proximo.pageSize })
    },
  }
}
