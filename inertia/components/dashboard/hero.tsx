import { Leaf, RefreshCw } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { SoftBadge } from '~/components/portal/soft_badge'
import type { Egresso } from '~/components/dashboard/types'

/**
 * Faixa de boas-vindas: avatar, saudação personalizada com o progresso da
 * turma e os campos pendentes, e o atalho "Revisar perfil".
 */
export function DashboardHero({
  egresso,
  pendentes,
  mapeadoPct,
}: {
  egresso: Egresso
  pendentes: number
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
            mapeada — falta você confirmar{' '}
            <span className="font-medium text-foreground">{pendentes} coisas</span>.
          </span>
        </h1>

        <div className="mt-1 text-muted-foreground text-sm">
          {egresso.curso} · Turma {egresso.turma} · {egresso.campus}
        </div>
      </div>

      <Button className="w-full shrink-0 sm:w-auto">
        <RefreshCw /> Revisar perfil
      </Button>
    </Card>
  )
}
