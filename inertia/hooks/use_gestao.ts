import { usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'

export type GestaoShared = NonNullable<Data.SharedProps['gestao']>
export type CursoResumo = GestaoShared['cursos'][number]

/**
 * Lê o shared prop `gestao` (montado pelo InertiaMiddleware quando o request
 * passou pelo gestor_middleware). Lança se chamado fora da área de gestão —
 * use em components que vivem sob o GestaoLayout.
 */
export function useGestao(): GestaoShared {
  const { gestao } = usePage<Data.SharedProps>().props
  if (!gestao) {
    throw new Error('useGestao chamado fora da área de gestão (gestor_middleware)')
  }
  return gestao
}
