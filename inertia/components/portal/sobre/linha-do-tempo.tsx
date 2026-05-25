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

export function LinhaDoTempo() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 03 · Histórico
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              <span className="text-primary">Doze anos</span>
              <br />
              de mapeamento.
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              O SAE é um programa de longo prazo — não uma pesquisa pontual. A continuidade é o que
              permite comparar gerações.
            </p>
          </div>

          <ol className="relative col-span-12 md:col-span-8">
            {/* vertical rail */}
            <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />

            {marks.map((m) => (
              <li
                key={m.year}
                className="relative grid grid-cols-[16px_1fr] gap-x-6 pb-8 last:pb-0"
              >
                <span
                  className={cn(
                    'relative z-10 mt-[7px] size-[15px] rounded-full border-2 bg-background',
                    m.now ? 'border-primary' : 'border-border'
                  )}
                >
                  {m.now && <span className="absolute inset-1 rounded-full bg-primary" />}
                </span>
                <div className="grid grid-cols-12 items-baseline gap-6">
                  <div className="col-span-12 md:col-span-3">
                    <div
                      className={cn(
                        'font-serif font-medium text-[26px] leading-none tracking-[-0.01em] tabular-nums',
                        m.now ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {m.year}
                    </div>
                    {m.now && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <span className="inline-block size-1.5 rounded-full bg-success" />
                        Agora
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="text-[16px] font-semibold leading-snug tracking-tight">
                      {m.title}
                    </h3>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {m.copy}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
