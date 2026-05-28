import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useTheme } from '~/hooks/use_theme'
import { cn } from '~/lib/utils'

const OPCOES: { valor: 'light' | 'dark' | 'system'; rotulo: string; Icone: LucideIcon }[] = [
  { valor: 'light', rotulo: 'Claro', Icone: Sun },
  { valor: 'dark', rotulo: 'Escuro', Icone: Moon },
  { valor: 'system', rotulo: 'Sistema', Icone: Monitor },
]

/**
 * Controle segmentado de tema (claro / escuro / sistema). Só ícones, pra caber
 * na largura do dropdown sem gerar scroll. Usa botões simples (não `MenuItem`)
 * para não fechar o menu ao trocar — o usuário vê a mudança na hora.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-0.5 rounded-md border bg-muted/40 p-0.5">
      {OPCOES.map(({ valor, rotulo, Icone }) => (
        <button
          key={valor}
          type="button"
          title={rotulo}
          aria-label={rotulo}
          aria-pressed={theme === valor}
          onClick={() => setTheme(valor)}
          className={cn(
            'flex flex-1 items-center justify-center rounded-sm py-1.5 transition-colors',
            theme === valor
              ? 'bg-background text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icone className="size-4" />
        </button>
      ))}
    </div>
  )
}
