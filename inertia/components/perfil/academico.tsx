import { Calendar, FileText, GraduationCap, Info, MapPin, Plus } from 'lucide-react'

import { type Data } from '@generated/data'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PerfilSectionCard } from '~/components/perfil/section_card'

type Vinculo = Data.Matricula.Variants['forPerfil']

type Props = {
  vinculos: Vinculo[]
}

const SITUACAO_LABEL: Record<Vinculo['situacao'], string> = {
  cursando: 'Em curso',
  formado: 'Concluído',
  evadido: 'Evadido',
}

const SITUACAO_BADGE: Record<Vinculo['situacao'], 'success' | 'info' | 'outline'> = {
  cursando: 'info',
  formado: 'success',
  evadido: 'outline',
}

/**
 * Lista de matrículas (vínculos acadêmicos) do egresso. Read-only — vem do
 * registro acadêmico. Egresso pode ter mais de um vínculo (graduação,
 * mestrado, etc.). Link "Fale com a coordenação" leva pra um canal a definir.
 */
export function PerfilAcademico({ vinculos }: Props) {
  return (
    <PerfilSectionCard
      id="academico"
      icon={GraduationCap}
      title="Vínculos acadêmicos"
      description="Suas matrículas na UFRRJ. Você pode ter mais de um curso (graduação, mestrado, doutorado…)."
    >
      <div className="space-y-3">
        {vinculos.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum vínculo encontrado.</p>
        )}
        {vinculos.map((v) => (
          <article key={v.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground text-xs uppercase tracking-wider">
                    {v.nivel}
                  </span>
                  <Badge variant={SITUACAO_BADGE[v.situacao]} className="gap-1.5">
                    <span className="inline-block size-1.5 rounded-full bg-current" />
                    {SITUACAO_LABEL[v.situacao]}
                  </Badge>
                </div>
                <div className="mt-1.5 font-semibold text-sm leading-snug">{v.curso}</div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {v.instituto}
                  </span>
                  {v.periodoFormatura && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {v.periodoFormatura}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" />
                    Matrícula{' '}
                    <span className="font-medium text-foreground tabular-nums">{v.codigo}</span>
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div
        className={cn(
          'mt-3 flex flex-wrap items-start justify-between gap-3',
          vinculos.length === 0 && 'mt-0'
        )}
      >
        <p className="flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            Dados do registro acadêmico. Algo incorreto ou falta um vínculo?{' '}
            <a href="#" className="font-medium text-primary underline-offset-2 hover:underline">
              Fale com a coordenação
            </a>
            .
          </span>
        </p>
        <Button variant="outline" size="sm" type="button" disabled>
          <Plus /> Vincular outra matrícula
        </Button>
      </div>
    </PerfilSectionCard>
  )
}
