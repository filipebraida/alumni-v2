import { BookOpen, LineChart, type LucideIcon, RefreshCw, Sparkles } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionHeader } from '~/components/portal/section_header'

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

export function UfrrjContrapartida() {
  return (
    <PortalSection id="contrapartida" surface="muted" border="bottom">
      <SectionHeader
        eyebrow="§ 01 · Entregas"
        aside="Material que serve pra autoavaliação, reforma curricular e renovação de reconhecimento — sem retrabalho."
      >
        O que o SAE coloca{' '}
        <span className="font-normal italic text-primary">na mesa da gestão.</span>
      </SectionHeader>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-2">
        {items.map(({ icon: Icon, title, copy, hint }, i) => (
          <article key={title} className="relative bg-card p-8">
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </div>
              <span className="font-serif text-sm font-medium text-muted-foreground/70 tabular-nums">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-balance font-serif text-2xl font-medium leading-tight tracking-tight">
              {title}
            </h3>
            <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
              {copy}
            </p>
            <div className="mt-5 inline-flex w-full items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
              <span className="inline-block size-1 rounded-full bg-brand-yellow" />
              <span className="uppercase tracking-wider">{hint}</span>
            </div>
          </article>
        ))}
      </div>
    </PortalSection>
  )
}
