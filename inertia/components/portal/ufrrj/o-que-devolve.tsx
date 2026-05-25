import { BookOpen, LineChart, LucideIcon, RefreshCw, Sparkles } from 'lucide-react'

const items: { icon: LucideIcon; title: string; copy: string; hint: string }[] = [
  {
    icon: LineChart,
    title: 'Painel vivo do seu curso.',
    copy: 'Dashboard por coorte, recortes por gênero/região/raça quando o n ≥ 5. Atualizado conforme os egressos respondem — não em janela única.',
    hint: 'Acesso contínuo · SSO via SIGAA',
  },
  {
    icon: BookOpen,
    title: 'Relatórios prontos para o MEC.',
    copy: 'Modelos pré-formatados para renovação de reconhecimento, autoavaliação CPA e relato de gestão. Exporta direto em DOCX ou PDF assinado.',
    hint: 'Formato Sinaes · ENADE-compatível',
  },
  {
    icon: RefreshCw,
    title: 'Comparativo entre cursos.',
    copy: 'Como sua coorte se compara com cursos da mesma grande área dentro da Rural — e com outras IES federais parceiras (dados anonimizados).',
    hint: 'Benchmark intra e inter-IES',
  },
  {
    icon: Sparkles,
    title: 'Insumo direto para o NDE.',
    copy: 'Recortes longitudinais que mostram se o perfil do egresso bate com o perfil declarado no PPC. Útil exatamente quando a reforma curricular começa.',
    hint: 'Alinhado ao art. 4º da Res. CNE/CES 1/2010',
  },
]

export function OQueDevolve() {
  return (
    <section id="deliverables" className="border-b bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 01 · Entregas
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              O que o SAE coloca{' '}
              <span className="font-normal text-primary italic">na mesa da gestão.</span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
            Material que serve pra autoavaliação, reforma curricular e renovação de reconhecimento —
            sem retrabalho.
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
          {items.map(({ icon: Icon, title, copy, hint }, i) => (
            <article key={title} className="relative bg-card p-8">
              <div className="flex items-start justify-between">
                <div className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </div>
                <span className="font-serif font-medium text-[14px] text-muted-foreground/70 tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-balance font-serif font-medium text-[22px] leading-[1.18] tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-2.5 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                {copy}
              </p>
              <div className="mt-5 inline-flex w-full items-center gap-2 border-t pt-4 text-[12px] text-muted-foreground">
                <span className="inline-block size-1 rounded-full bg-brand-yellow" />
                <span className="uppercase tracking-wider">{hint}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
