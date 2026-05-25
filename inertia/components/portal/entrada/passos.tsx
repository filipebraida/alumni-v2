import { Check, LineChart, LucideIcon, User } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'

const steps: { n: string; icon: LucideIcon; title: string; copy: string }[] = [
  {
    n: '01',
    icon: User,
    title: 'Você entra com o e-mail @ufrrj.br',
    copy: 'Mandamos um link de acesso pro seu e-mail institucional. Sem senha pra criar nem lembrar.',
  },
  {
    n: '02',
    icon: Check,
    title: 'Confirma 8 dados em 30 segundos',
    copy: 'Os mesmos campos que a Rural envia ao MEC todo ano. Toque "sim, ainda" ou edite o que mudou.',
  },
  {
    n: '03',
    icon: LineChart,
    title: 'Recebe a leitura da sua turma',
    copy: 'Onde estão os colegas, faixa salarial agregada, tempo até o 1º emprego — sempre anonimizado.',
  },
]

export function EntradaPassos() {
  return (
    <PortalSection id="passos" surface="muted" border="both" containerClassName="py-16">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <SectionEyebrow>Como funciona</SectionEyebrow>
          <SectionHeading className="mt-2 text-3xl md:text-4xl">
            Três passos.
            <br />
            <span className="font-normal text-primary italic">Uma vez por ano.</span>
          </SectionHeading>
          <p className="mt-3 max-w-sm text-pretty text-sm text-muted-foreground">
            Foi desenhado para caber no intervalo de um café. O resto do tempo, o SAE só te avisa
            quando algo da sua turma mudar.
          </p>
        </div>

        <div className="col-span-12 grid gap-4 md:col-span-8 md:grid-cols-3">
          {steps.map(({ n, icon: Icon, title, copy }) => (
            <article key={n} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-medium leading-none text-primary tabular-nums">
                  {n}
                </span>
                <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>
              <h3 className="mt-5 text-sm font-semibold leading-snug tracking-tight">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </PortalSection>
  )
}
