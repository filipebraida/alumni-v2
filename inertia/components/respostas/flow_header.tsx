import { Link } from '@adonisjs/inertia/react'
import { X } from 'lucide-react'
import { PortalLogo } from '~/components/portal/logo'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'

/**
 * Cabeçalho enxuto do fluxo: marca, título, progresso e o "fechar" (volta ao
 * painel sem enviar). Sem a navegação do app — foco na tarefa.
 */
export function FlowHeader({ prontos, total }: { prontos: number; total: number }) {
  const pct = total > 0 ? Math.round((prontos / total) * 100) : 0

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center gap-4 px-4 sm:px-6">
        <Link route="dashboard" className="flex items-center gap-2.5">
          <PortalLogo />
          <span className="hidden font-semibold text-sm tracking-tight sm:inline">
            SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <SectionEyebrow>Atualizar perfil</SectionEyebrow>
          <div className="font-medium text-sm">Confirme seus dados</div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-muted-foreground text-xs tabular-nums">
            {prontos} de {total} · {pct}%
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <Link
          route="dashboard"
          aria-label="Fechar"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </Link>
      </div>
    </header>
  )
}
