import { Link } from '@adonisjs/inertia/react'
import { Camera, CheckSquare } from 'lucide-react'
import { buttonVariants } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'
import type { Snapshot } from '~/components/dashboard/types'

/**
 * Barra sticky no rodapé: o egresso confirma TUDO de uma vez — dados gerais +
 * cada formação — e isso vira uma foto consistente (snapshot) que vai pro MEC.
 * Mostra o que falta revisar e quando foi a última foto.
 */
export function DashboardConfirmBar({
  snapshot,
  globalPendentes,
}: {
  snapshot: Snapshot
  globalPendentes: number
}) {
  return (
    <div className="sticky bottom-4 z-20 pt-1">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card/95 px-5 py-3.5 shadow-lg supports-[backdrop-filter]:bg-card/80 supports-[backdrop-filter]:backdrop-blur">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Camera className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm tracking-tight">Confirmar tudo de uma vez</div>
          <div className="text-muted-foreground text-xs">
            Gera uma <span className="font-medium text-foreground">foto</span> da sua situação em{' '}
            {snapshot.hoje}.
            {globalPendentes > 0 ? (
              <>
                {' '}
                Revise os{' '}
                <span className="font-medium text-foreground">{globalPendentes} itens</span>{' '}
                sinalizados antes de enviar.
              </>
            ) : (
              <> Tudo conferido — pronto para registrar.</>
            )}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-4">
          <div className="hidden text-right text-muted-foreground text-xs leading-tight lg:block">
            Última foto
            <div className="font-medium text-foreground">{snapshot.ultimaFoto}</div>
          </div>
          <Separator orientation="vertical" className="hidden h-9 lg:block" />
          <Link route="respostas.create" className={cn(buttonVariants(), 'h-10 px-5')}>
            <CheckSquare /> Confirmar tudo
          </Link>
        </div>
      </div>
    </div>
  )
}
