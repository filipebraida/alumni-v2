import { ArrowRight, Mail, Plus, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { DashboardSectionHeader } from '~/components/dashboard/section_header'
import type { Colega } from '~/components/dashboard/types'

const VISIVEIS = 3

/**
 * "Reencontre sua turma": colegas da formação escopada — perfis preenchidos
 * ganham botão de conectar; quem ainda não preencheu aparece como "ainda não
 * preencheu o perfil" com convite. Mostra os 3 primeiros + atalho pra lista.
 */
export function DashboardReencontro({
  colegas,
  total,
  contexto,
}: {
  colegas: Colega[]
  total: number
  contexto: string
}) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <DashboardSectionHeader
        icon={Users}
        title="Reencontre sua turma"
        description={`Quem estudou ${contexto} com você`}
        action={<Badge variant="outline">{total}&nbsp;colegas</Badge>}
      />

      <ul className="divide-y border-t">
        {colegas.slice(0, VISIVEIS).map((colega) => (
          <li key={colega.nome} className="flex items-center gap-3 px-5 py-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-muted font-semibold text-foreground text-xs">
                {colega.iniciais}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-sm">{colega.nome}</div>
              {colega.status === 'ativo' ? (
                <>
                  <div className="truncate text-muted-foreground text-xs">{colega.cargo}</div>
                  <div className="truncate text-muted-foreground text-xs">{colega.cidade}</div>
                </>
              ) : (
                <div className="text-muted-foreground text-xs italic">
                  Ainda não preencheu o perfil
                </div>
              )}
            </div>
            {colega.status === 'ativo' ? (
              <Button size="sm" variant="outline">
                <Plus /> Conectar
              </Button>
            ) : (
              <Button size="sm" variant="ghost">
                <Mail /> Convidar
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t p-3">
        <Button variant="ghost" size="sm" className="ml-auto">
          Ver os {total} colegas <ArrowRight />
        </Button>
      </div>
    </Card>
  )
}
