import { Link } from '@adonisjs/inertia/react'
import { Leaf, RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { buttonVariants } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'
import type { Egresso } from '~/components/dashboard/types'

/**
 * Faixa de boas-vindas: avatar, saudação com o progresso da turma e o que ainda
 * falta, e o CTA de atualização (leva ao fluxo dedicado, não edita aqui).
 */
export function DashboardHero({
  egresso,
  faltando,
  mapeadoPct,
}: {
  egresso: Egresso
  faltando: number
  mapeadoPct: number
}) {
  return (
    <Card className="flex flex-col gap-4 p-5 shadow-sm sm:flex-row sm:items-center sm:gap-5">
      <Avatar className="size-12 shrink-0 sm:size-14">
        <AvatarFallback className="bg-primary font-semibold text-base text-primary-foreground">
          {egresso.iniciais}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">
            {egresso.agora}
          </span>
          {egresso.verificada && (
            <SoftBadge tone="primary">
              <Leaf className="size-3" /> Egressa verificada
            </SoftBadge>
          )}
        </div>

        <h1 className="mt-1 font-semibold text-lg leading-tight tracking-tight sm:text-xl">
          {egresso.saudacao}, {egresso.primeiroNome}.{' '}
          <span className="font-normal text-muted-foreground">
            Sua turma já é <span className="font-medium text-foreground">{mapeadoPct}%</span>{' '}
            mapeada
            {faltando > 0 ? (
              <>
                {' '}
                — faltam <span className="font-medium text-foreground">{faltando} dados</span> seus.
              </>
            ) : (
              '.'
            )}
          </span>
        </h1>

        <div className="mt-1 text-muted-foreground text-sm">
          {egresso.curso} · Turma {egresso.turma} · {egresso.instituto}
        </div>
      </div>

      <Link route="respostas.create" className={cn(buttonVariants(), 'w-full shrink-0 sm:w-auto')}>
        <RefreshCw /> Atualizar meus dados
      </Link>
    </Card>
  )
}
