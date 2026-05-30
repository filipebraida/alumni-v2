import { type ReactNode } from 'react'

import { cn } from '~/lib/utils'

type Props = {
  rotulo: string
  valor: ReactNode
  className?: string
  /** Permite quebra de linha (ex: campo "Resumo"). Default: truncate. */
  multilinha?: boolean
}

/** Par rótulo/valor read-only — usado em show e em recap blocks. */
export function PerfilLinha({ rotulo, valor, className, multilinha = false }: Props) {
  const vazio = valor === null || valor === undefined || valor === ''
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-muted-foreground text-xs uppercase tracking-wide">{rotulo}</dt>
      <dd
        className={cn(
          'mt-0.5 text-sm',
          vazio && 'text-muted-foreground',
          !multilinha && 'truncate'
        )}
      >
        {vazio ? '—' : valor}
      </dd>
    </div>
  )
}
