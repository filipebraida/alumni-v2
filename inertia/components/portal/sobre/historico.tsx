import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'
import { SoftBadge } from '~/components/portal/soft_badge'
import { cn } from '~/lib/utils'

const marks: { year: string; title: string; copy: string; now?: boolean }[] = [
  {
    year: '2014',
    title: 'Programa-piloto',
    copy: 'Resolução CONSU 12/2014 institui o SAE como programa permanente da PROGRAD. Início pelas Ciências Agrárias.',
  },
  {
    year: '2017',
    title: 'Primeira pesquisa estruturada',
    copy: 'Levantamento amostral em 6 cursos, conduzido em parceria com o DPADE. Define o questionário-base que ainda é usado hoje.',
  },
  {
    year: '2020',
    title: 'Plataforma digital v1',
    copy: 'Migração de planilhas para sistema próprio, integrado ao SIGAA. Cadastro passa a ser feito direto pelo egresso.',
  },
  {
    year: '2023',
    title: 'Conformidade Sinaes',
    copy: 'Auditoria do MEC certifica o SAE como instrumento válido de avaliação institucional. Adesão dos 47 cursos.',
  },
  {
    year: '2026',
    title: 'Versão atual',
    copy: 'Reformulação editorial. Foco em devolutiva ao egresso (não só extração) e em transparência ativa dos relatórios.',
    now: true,
  },
]

export function SobreHistorico() {
  return (
    <PortalSection surface="muted" border="both">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-4">
          <SectionEyebrow>§ 03 · Histórico</SectionEyebrow>
          <SectionHeading className="mt-2">
            <span className="text-primary">Doze anos</span>
            <br />
            de mapeamento.
          </SectionHeading>
          <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            O SAE é um programa de longo prazo — não uma pesquisa pontual. A continuidade é o que
            permite comparar gerações.
          </p>
        </div>

        <ol className="relative col-span-12 md:col-span-8">
          {/* vertical rail, centered on the 16px markers (left-2 = 8px) */}
          <div aria-hidden className="absolute bottom-2 left-2 top-2 w-px bg-border" />

          {marks.map((m) => (
            <li key={m.year} className="relative flex gap-6 pb-8 last:pb-0">
              <span
                className={cn(
                  'relative z-10 mt-1.5 size-4 shrink-0 rounded-full border-2 bg-background',
                  m.now ? 'border-primary' : 'border-border'
                )}
              >
                {m.now && <span className="absolute inset-1 rounded-full bg-primary" />}
              </span>
              <div className="grid flex-1 grid-cols-12 items-baseline gap-6">
                <div className="col-span-12 md:col-span-3">
                  <div
                    className={cn(
                      'font-serif text-2xl font-medium leading-none tracking-tight tabular-nums',
                      m.now ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {m.year}
                  </div>
                  {m.now && (
                    <SoftBadge className="mt-2">
                      <span className="inline-block size-1.5 rounded-full bg-success" />
                      Agora
                    </SoftBadge>
                  )}
                </div>
                <div className="col-span-12 md:col-span-9">
                  <h3 className="text-base font-semibold leading-snug tracking-tight">{m.title}</h3>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {m.copy}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PortalSection>
  )
}
