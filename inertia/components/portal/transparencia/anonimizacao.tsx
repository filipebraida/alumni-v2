import { Check } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'

function AnonRow({
  uf,
  n,
  below = false,
  last = false,
  kept = false,
  agg = false,
}: {
  uf: string
  n: number | string
  below?: boolean
  last?: boolean
  kept?: boolean
  agg?: boolean
}) {
  return (
    <tr className={cn(!last && 'border-b border-border/60')}>
      <td
        className={cn(
          'py-2',
          below && 'text-muted-foreground/50 line-through',
          kept && !agg && 'text-foreground',
          agg && 'text-muted-foreground italic'
        )}
      >
        {uf}
      </td>
      <td
        className={cn(
          'py-2 text-right tabular-nums',
          below && 'text-destructive',
          kept && 'text-foreground'
        )}
      >
        {n}
      </td>
    </tr>
  )
}

function AnonTableHead() {
  return (
    <thead className="text-xs uppercase tracking-wider text-muted-foreground">
      <tr className="border-b">
        <th className="py-2 text-left font-medium">Estado</th>
        <th className="py-2 text-right font-medium">n</th>
      </tr>
    </thead>
  )
}

const rules = [
  <>
    <strong className="font-medium text-foreground">Mínimo n = 5</strong> em todo recorte público.
  </>,
  <>
    Cruzamentos só quando os <strong className="font-medium text-foreground">dois eixos</strong>{' '}
    tiverem n ≥ 5.
  </>,
  <>
    Faixa salarial <strong className="font-medium text-foreground">sempre em faixas</strong>, nunca
    valor.
  </>,
  <>
    Localização agregada por <strong className="font-medium text-foreground">UF</strong>, nunca CEP.
  </>,
]

export function TransparenciaAnonimizacao() {
  return (
    <PortalSection id="anonimizacao">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-4">
          <SectionEyebrow>§ 02 · Anonimização</SectionEyebrow>
          <SectionHeading className="mt-2">
            Uma regra, <span className="font-normal italic text-foreground/85">sem exceção.</span>
          </SectionHeading>
          <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Nenhum recorte é publicado com menos de{' '}
            <strong className="font-medium text-foreground">5 respondentes</strong>. Mesmo agregado,
            mesmo bem intencionado. Se passa de 4 pra 5, aparece. Se cai de 5 pra 4, some.
          </p>

          <div className="mt-7 rounded-xl border bg-muted/30 p-5 font-mono text-xs leading-relaxed text-muted-foreground">
            <div className="mb-2 font-semibold text-foreground">A regra, no código:</div>
            <code className="block">
              <span className="text-primary">if</span> recorte.n{' '}
              <span className="text-primary">&lt;</span> <span className="text-brand-yellow">5</span>
              :
              <br />
              {'  '}
              <span className="text-primary">return</span>{' '}
              <span className="text-foreground">"—"</span>{' '}
              <span className="text-muted-foreground/70"># suprimido</span>
              <br />
              <span className="text-primary">else</span>:<br />
              {'  '}
              <span className="text-primary">return</span> recorte.
              <span className="text-foreground">publicar</span>()
            </code>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Exemplo · Eng. Florestal 2019 · onde estão
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* BEFORE */}
            <div className="rounded-2xl border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Dado bruto · interno
                </div>
                <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-foreground">
                  Não publicado
                </span>
              </div>
              <table className="w-full font-mono text-sm">
                <AnonTableHead />
                <tbody>
                  <AnonRow uf="RJ" n={52} />
                  <AnonRow uf="SP" n={15} />
                  <AnonRow uf="MG" n={7} />
                  <AnonRow uf="ES" n={5} />
                  <AnonRow uf="BA" n={3} below />
                  <AnonRow uf="DF" n={2} below />
                  <AnonRow uf="EXT" n={1} below last />
                </tbody>
              </table>
            </div>

            {/* AFTER */}
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Publicável
                </div>
                <SoftBadge>
                  <Check className="size-3" />
                  Sai no relatório
                </SoftBadge>
              </div>
              <table className="w-full font-mono text-sm">
                <AnonTableHead />
                <tbody>
                  <AnonRow uf="RJ" n={52} kept />
                  <AnonRow uf="SP" n={15} kept />
                  <AnonRow uf="MG" n={7} kept />
                  <AnonRow uf="ES" n={5} kept />
                  <AnonRow uf="Outros" n="6" kept agg last />
                </tbody>
              </table>
              <div className="mt-4 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
                Os 6 egressos abaixo do limiar foram agregados em "Outros". Nem o estado nem o n
                original sobrevivem ao corte.
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalSection>
  )
}
