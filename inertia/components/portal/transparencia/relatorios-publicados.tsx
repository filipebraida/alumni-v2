import { ArrowUpRight, Download } from 'lucide-react'
import { SoftBadge } from '~/components/portal/soft-badge'
import { cn } from '~/lib/utils'

type Report = {
  year: string
  title: string
  pages: number
  size: string
  downloads: string
  tag: string | null
}

const reports: Report[] = [
  {
    year: '2025',
    title: 'Relatório SAE 2025',
    pages: 136,
    size: '8,2 MB',
    downloads: '1.284',
    tag: 'Edição mais recente',
  },
  {
    year: '2024',
    title: 'Relatório SAE 2024',
    pages: 124,
    size: '7,6 MB',
    downloads: '4.102',
    tag: null,
  },
  {
    year: '2023',
    title: 'Relatório SAE 2023 · primeiro pós-Sinaes',
    pages: 118,
    size: '7,1 MB',
    downloads: '3.860',
    tag: 'Marco Sinaes',
  },
  {
    year: '2022',
    title: 'Relatório SAE 2022',
    pages: 102,
    size: '6,4 MB',
    downloads: '2.910',
    tag: null,
  },
  {
    year: '2021',
    title: 'Relatório SAE 2021',
    pages: 96,
    size: '5,8 MB',
    downloads: '2.244',
    tag: null,
  },
  {
    year: '2020',
    title: 'Relatório SAE 2020 · plataforma v1',
    pages: 88,
    size: '5,2 MB',
    downloads: '3.105',
    tag: 'Mudança metodológica',
  },
  {
    year: '2019',
    title: 'Relatório SAE 2019',
    pages: 76,
    size: '4,8 MB',
    downloads: '1.508',
    tag: null,
  },
  {
    year: '2018',
    title: 'Relatório SAE 2018',
    pages: 68,
    size: '4,1 MB',
    downloads: '1.220',
    tag: null,
  },
  {
    year: '2017',
    title: 'Pesquisa SAE 2017 · piloto Agrárias',
    pages: 54,
    size: '3,2 MB',
    downloads: '892',
    tag: 'Origem',
  },
]

function RpStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-[13px] font-medium text-foreground tabular-nums">
        {value}
      </div>
    </div>
  )
}

export function RelatoriosPublicados() {
  const [featured, ...rest] = reports

  return (
    <section id="relatorios" className="border-b bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 01 · Relatórios anuais
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Tudo o que já foi{' '}
              <span className="font-normal text-foreground/85 italic">publicado.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
            Cada PDF acompanha o conjunto de microdados
            <br className="hidden md:block" />
            anonimizados em CSV.
          </div>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-5">
          {/* Featured current edition */}
          <a
            href="#"
            className="group relative col-span-12 overflow-hidden rounded-2xl border bg-card p-8 transition-colors hover:bg-muted/30 md:col-span-5"
          >
            {featured.tag && (
              <SoftBadge tone="yellow" className="mb-5">
                {featured.tag}
              </SoftBadge>
            )}
            <div className="font-serif font-medium text-[80px] leading-none tracking-[-0.02em] text-primary tabular-nums">
              ’{featured.year.slice(2)}
            </div>
            <h3 className="mt-4 text-balance font-serif font-medium text-[24px] leading-[1.15] tracking-[-0.01em]">
              {featured.title}
            </h3>
            <div className="mt-5 grid grid-cols-3 gap-4 border-y py-4 text-[12px]">
              <RpStat label="Páginas" value={featured.pages} />
              <RpStat label="Tamanho" value={featured.size} />
              <RpStat label="Downloads" value={featured.downloads} />
            </div>
            <div className="mt-5 flex items-center justify-between text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <Download className="size-4 text-primary" />
                Baixar PDF
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                Microdados CSV <ArrowUpRight className="size-3" />
              </span>
            </div>
          </a>

          {/* Other years */}
          <div className="col-span-12 md:col-span-7">
            <ul className="overflow-hidden rounded-2xl border bg-card">
              {rest.map((r, i) => (
                <li key={r.year} className={cn(i > 0 && 'border-t')}>
                  <a
                    href="#"
                    className="group grid grid-cols-[64px_1fr_auto] items-center gap-5 px-6 py-5 transition-colors hover:bg-muted/30"
                  >
                    <span className="font-serif font-medium text-[26px] leading-none tracking-[-0.01em] text-foreground tabular-nums">
                      {r.year}
                    </span>
                    <div className="min-w-0">
                      <div className="text-balance text-[14.5px] font-semibold leading-snug tracking-tight">
                        {r.title}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
                        <span className="font-mono">
                          {r.pages} págs · {r.size} · {r.downloads} downloads
                        </span>
                        {r.tag && (
                          <>
                            <span className="opacity-40">·</span>
                            <span className="text-[10.5px] uppercase tracking-wider text-foreground/70">
                              {r.tag}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="grid size-9 place-items-center rounded-md border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                      <Download className="size-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-3 text-right text-[12px] text-muted-foreground">
              Edições anteriores a 2017 não foram digitalizadas ·{' '}
              <a href="#" className="text-foreground underline-offset-4 hover:underline">
                solicitar via Fala.BR
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
