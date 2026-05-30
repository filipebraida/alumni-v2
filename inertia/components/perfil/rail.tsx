import { type LucideIcon } from 'lucide-react'

import { cn } from '~/lib/utils'
import { PerfilCompletude } from '~/components/perfil/completude'

export type PerfilSecaoId = 'foto' | 'contato' | 'academico' | 'ids' | 'privacidade'

export type PerfilSecao = {
  id: PerfilSecaoId
  icon: LucideIcon
  label: string
}

type Props = {
  secoes: readonly PerfilSecao[]
  ativo: PerfilSecaoId
  onIrPara: (id: PerfilSecaoId) => void
  preenchidos: number
  total: number
}

/**
 * Coluna esquerda da tela "Editar perfil": título da página, navegação por
 * âncoras (com destaque na seção visível) e o card de completude. Some abaixo
 * de lg — a navegação por âncora ainda funciona via scroll natural.
 */
export function PerfilRail({ secoes, ativo, onIrPara, preenchidos, total }: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-6">
        <div>
          <h1 className="font-semibold text-xl tracking-tight">Editar perfil</h1>
          <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
            Mantenha seus dados frescos — a UFRRJ usa só em análises agregadas.
          </p>
        </div>

        <nav className="-mx-2 flex flex-col gap-0.5">
          {secoes.map((s) => {
            const Icon = s.icon
            const isActive = ativo === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onIrPara(s.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left font-medium text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" /> {s.label}
              </button>
            )
          })}
        </nav>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <PerfilCompletude preenchidos={preenchidos} total={total} />
          <p className="mt-3 text-muted-foreground text-xs leading-relaxed">
            Perfis completos aparecem com mais clareza para colegas e coordenação.
          </p>
        </div>
      </div>
    </aside>
  )
}
