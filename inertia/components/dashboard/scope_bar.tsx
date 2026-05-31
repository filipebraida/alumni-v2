import { Filter } from 'lucide-react'
import type { Formacao } from '~/components/dashboard/types'

/**
 * Faixa fina abaixo do seletor de formação: lembra o leitor de que mapa,
 * colegas e insights logo abaixo estão escopados àquela formação específica.
 */
export function DashboardScopeBar({ formacao }: { formacao: Formacao }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-muted-foreground text-xs">
      <Filter className="size-3.5 shrink-0 text-primary" />
      <span className="whitespace-nowrap">Mostrando dados de</span>
      <span className="whitespace-nowrap rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
        {formacao.diploma}
      </span>
      <span className="whitespace-nowrap text-muted-foreground/70">· {formacao.periodo}</span>
    </div>
  )
}
