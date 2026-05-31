import { cn } from '~/lib/utils'
import { PerfilCompletude } from '~/components/perfil/completude'
import {
  SECOES,
  TOTAL_CAMPOS_PUBLICOS,
  type PerfilSecao,
  type PerfilSecaoId,
  irParaSecao,
} from '~/components/perfil/secoes'

type Props = {
  titulo: string
  descricao: string
  ativo: PerfilSecaoId
  preenchidos: number
  /** Lista de seções a exibir no nav (default: todas). */
  secoes?: readonly PerfilSecao[]
  /** Override do destino do clique (default: scroll na própria página). */
  onIrPara?: (id: PerfilSecaoId) => void
}

/**
 * Coluna esquerda das telas de perfil (show e edit): título + descrição
 * customizáveis, navegação por âncoras com destaque na seção visível, e o
 * card de completude. Escondida abaixo de `lg` — a navegação por âncora
 * ainda funciona via scroll natural da página.
 */
export function PerfilRail({
  titulo,
  descricao,
  ativo,
  preenchidos,
  secoes = SECOES,
  onIrPara,
}: Props) {
  const navegar = onIrPara ?? irParaSecao

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-6">
        <div>
          <h1 className="font-semibold text-xl tracking-tight">{titulo}</h1>
          <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{descricao}</p>
        </div>

        <nav className="-mx-2 flex flex-col gap-0.5">
          {secoes.map((s) => {
            const Icon = s.icon
            const isActive = ativo === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => navegar(s.id)}
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
          <PerfilCompletude preenchidos={preenchidos} total={TOTAL_CAMPOS_PUBLICOS} />
          <p className="mt-3 text-muted-foreground text-xs leading-relaxed">
            Perfis completos aparecem com mais clareza para colegas e coordenação.
          </p>
        </div>
      </div>
    </aside>
  )
}
