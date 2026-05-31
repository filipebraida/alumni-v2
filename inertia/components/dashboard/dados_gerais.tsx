import { Check, User } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { MecCard } from '~/components/dashboard/mec_card'
import type { CampoMec } from '~/components/dashboard/types'

/**
 * "Dados gerais": campos pessoais/profissionais que valem para TODAS as
 * formações do egresso. Uma confirmação só, embaixo da página.
 */
export function DashboardDadosGerais({ campos }: { campos: CampoMec[] }) {
  const pendentes = campos.filter((c) => c.confianca !== 'confirmado').length

  return (
    <Card className="shadow-sm">
      <header className="flex flex-wrap items-end justify-between gap-4 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold text-base tracking-tight">
            <User className="size-4 shrink-0 text-primary" /> Dados gerais
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Valem para todas as suas formações. Edite o que mudou — a confirmação é feita de uma vez
            só, embaixo.
          </p>
        </div>
        {pendentes > 0 ? (
          <Badge variant="warning">{pendentes}&nbsp;a revisar</Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Check className="size-3" /> em dia
          </Badge>
        )}
      </header>
      <Separator />
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {campos.map((campo) => (
          <MecCard key={campo.chave} campo={campo} />
        ))}
      </div>
    </Card>
  )
}
