import { Briefcase, Info, MapPin } from 'lucide-react'

import { type Data } from '@generated/data'
import { Badge } from '~/components/ui/badge'
import { PerfilSectionCard } from '~/components/perfil/section_card'

type Props = {
  gestor: Data.Gestor.Variants['forPerfil']
}

/**
 * Lista de cursos coordenados pelo gestor (read-only). Vem da pivot
 * `gestor_cursos` mantida pela administração — não é editável aqui.
 */
export function PerfilCoordenacao({ gestor }: Props) {
  return (
    <PerfilSectionCard
      id="coordenacao"
      icon={Briefcase}
      title="Coordenação"
      description="Cursos que você coordena na UFRRJ."
    >
      {gestor.cargo && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs uppercase tracking-wide">Cargo</span>
          <span className="font-medium text-sm">{gestor.cargo}</span>
        </div>
      )}

      <div className="space-y-3">
        {gestor.cursos.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Você ainda não está vinculado a nenhum curso como coordenador.
          </p>
        )}
        {gestor.cursos.map((c) => (
          <article key={c.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground text-xs uppercase tracking-wider">
                    {c.nivel}
                  </span>
                  <Badge variant="outline" className="tabular-nums">
                    {c.codigo}
                  </Badge>
                </div>
                <div className="mt-1.5 font-semibold text-sm leading-snug">{c.nome}</div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {c.instituto}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 text-muted-foreground text-xs leading-relaxed">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Vínculos de coordenação são gerenciados pela administração. Para mudanças, fale com a
          PROGRAD.
        </span>
      </p>
    </PerfilSectionCard>
  )
}
