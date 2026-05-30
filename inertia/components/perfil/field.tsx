import { type ReactNode } from 'react'

import { cn } from '~/lib/utils'

type Props = {
  label: string
  hint?: string
  className?: string
  children: ReactNode
}

/**
 * Linha de formulário no perfil: label em cima, slot do input, hint abaixo.
 * Hint ABAIXO do input (não inline com o label) pra que labels com e sem
 * hint mantenham a mesma altura entre colunas — assim os inputs alinham
 * em grids 2-col em telas intermediárias.
 */
export function PerfilField({ label, hint, className, children }: Props) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block font-medium text-sm">{label}</span>
      {children}
      {hint && <p className="mt-1 text-muted-foreground text-xs leading-relaxed">{hint}</p>}
    </label>
  )
}

/**
 * Input nativo já estilizado no padrão do perfil. Usar dentro de `PerfilField`.
 */
export function PerfilInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    />
  )
}

export function PerfilTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    />
  )
}
