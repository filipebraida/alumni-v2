import { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { PortalLogo } from '~/components/portal/logo'
import { SoftBadge } from '~/components/portal/soft-badge'
import { cn } from '~/lib/utils'

function PpRow({
  term,
  def,
  last = false,
  muted = false,
  badge = false,
}: {
  term: string
  def: string
  last?: boolean
  muted?: boolean
  badge?: boolean
}) {
  return (
    <div className={cn('flex items-baseline gap-3', !last && 'border-b pb-3')}>
      <dt className="w-28 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
        {term}
      </dt>
      <dd className={cn('flex-1', muted ? 'text-muted-foreground' : 'text-foreground')}>
        {badge ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-success" />
            {def}
          </span>
        ) : (
          (def as ReactNode)
        )}
      </dd>
    </div>
  )
}

/** Editorial mock of the logged-in egresso profile — the "passport". */
export function Passaporte() {
  return (
    <div className="relative">
      {/* Offset back card for editorial depth. */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border bg-muted/30"
      />

      <div className="relative rounded-2xl border bg-card p-7 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Passaporte do Egresso
          </div>
          <PortalLogo />
        </div>

        <div className="mt-7 flex items-center gap-4">
          <Avatar className="size-14 bg-primary/10">
            <AvatarFallback className="bg-primary/10 text-[15px] font-semibold text-primary">
              CB
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-serif font-medium text-[22px] leading-tight tracking-[-0.01em]">
              Caio B. Mattos
            </div>
            <div className="mt-0.5 text-[12.5px] text-muted-foreground">
              Eng. Florestal · turma de 2019
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-[13px]">
          <PpRow term="Matrícula" def="2015 · IF/Seropédica" />
          <PpRow term="Status atual" def="Empregado · setor privado" badge />
          <PpRow term="Localização" def="Belo Horizonte · MG" />
          <PpRow term="Última atualização" def="há 3 meses" muted last />
        </dl>

        <div className="mt-6 flex items-center justify-between border-t pt-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Vínculo institucional
          </div>
          <SoftBadge>
            <span className="inline-block size-1.5 rounded-full bg-success" />
            Ativo
          </SoftBadge>
        </div>

        {/* Class-year stamp — graduation seal. */}
        <div
          aria-hidden
          className="absolute -bottom-3 -right-3 grid size-20 -rotate-[8deg] place-items-center rounded-full border border-brand-yellow/50 bg-brand-yellow/20 text-warning-foreground shadow-sm"
        >
          <div className="text-center leading-none">
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-70">
              Turma
            </div>
            <div className="mt-1.5 font-serif font-medium text-[24px] tracking-[-0.02em] tabular-nums">
              ’19
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
