import { Link } from '@adonisjs/inertia/react'
import { Leaf, RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { Egresso } from '~/components/dashboard/types'

type Modo = 'manutencao' | 'primeira'

// `globalPendentes` conta só pendências por formação. Pendência de dados gerais
// fica no header daquele bloco (decisão do brief multi-formação).
export function DashboardHero({
  egresso,
  totalFormacoes,
  concluidas,
  emCurso,
  globalPendentes,
  modo,
}: {
  egresso: Egresso
  totalFormacoes: number
  concluidas: number
  emCurso: number
  globalPendentes: number
  modo: Modo
}) {
  const fmtFormacoes = `${totalFormacoes} ${totalFormacoes === 1 ? 'formação' : 'formações'}`

  return (
    <Card className="flex flex-col gap-4 p-5 shadow-sm sm:flex-row sm:items-center sm:gap-5">
      <Avatar className="size-12 shrink-0 sm:size-14">
        <AvatarFallback className="bg-primary font-semibold text-base text-primary-foreground">
          {egresso.iniciais}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
            {egresso.agora}
          </span>
          {egresso.verificada && (
            <Badge variant="secondary" className="gap-1">
              <Leaf className="size-3" /> Egressa verificada
            </Badge>
          )}
        </div>

        <h1 className="mt-1 font-semibold text-xl leading-tight tracking-tight sm:text-2xl">
          {modo === 'primeira' ? 'Vamos começar' : egresso.saudacao}, {egresso.primeiroNome}.{' '}
          <span className="font-normal text-muted-foreground">
            Você tem <span className="font-medium text-foreground">{fmtFormacoes}</span> na UFRRJ
            {modo === 'primeira' ? (
              <>
                {' '}
                e <span className="font-medium text-foreground">{globalPendentes} campos</span> para
                preencher antes da sua primeira resposta.
              </>
            ) : (
              <>
                {' '}
                e <span className="font-medium text-foreground">{globalPendentes} itens</span> para
                revisar antes da próxima resposta.
              </>
            )}
          </span>
        </h1>

        <div className="mt-1 text-muted-foreground text-sm">
          {concluidas} concluída{concluidas !== 1 ? 's' : ''} · {emCurso} em curso ·{' '}
          {egresso.campus}
        </div>
      </div>

      <Link route="respostas.create" className={cn(buttonVariants(), 'shrink-0')}>
        <RefreshCw /> Revisar perfil
      </Link>
    </Card>
  )
}
