import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  Globe,
  LineChart,
  LucideIcon,
  Users,
} from 'lucide-react'

const items: { icon: LucideIcon; title: string; copy: string; cta: string }[] = [
  {
    icon: LineChart,
    title: 'A leitura da sua turma.',
    copy: 'Onde os 84 colegas da sua coorte foram parar, faixa salarial mediana, quem foi pra pós, quem mudou de área. Tudo anonimizado.',
    cta: 'Ver minha turma',
  },
  {
    icon: Briefcase,
    title: 'Mural de vagas dos colegas.',
    copy: 'Posições indicadas por egressos da UFRRJ pra outros egressos. Sem algoritmo, sem candidatura cega: alguém da Rural te apresenta.',
    cta: 'Abrir mural',
  },
  {
    icon: Users,
    title: 'Mentoria entre gerações.',
    copy: 'Você pode pedir 30 minutos com alguém formado há mais tempo na sua área. Ou oferecer pra quem tá saindo agora.',
    cta: 'Encontrar mentor',
  },
  {
    icon: BookOpen,
    title: 'Declarações em 1 clique.',
    copy: 'Histórico, ementa, declaração de conclusão, comprovação de vínculo. Assinadas digitalmente, válidas em concurso público.',
    cta: 'Solicitar documento',
  },
  {
    icon: Calendar,
    title: 'Convite pros reencontros.',
    copy: 'A turma que faz 5, 10, 20 anos de formada recebe o convite automático. Você decide se vai — a gente só não esquece de avisar.',
    cta: 'Próximos encontros',
  },
  {
    icon: Globe,
    title: 'Acesso vitalício à biblioteca.',
    copy: 'Periódicos CAPES, repositório institucional, base de TCCs. Continua valendo enquanto seu vínculo de egresso estiver ativo.',
    cta: 'Acessar biblioteca',
  },
]

export function OQueVoceRecebe() {
  return (
    <section id="beneficios" className="border-b bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 01 · O que você recebe
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Seis coisas concretas.{' '}
              <span className="font-normal text-primary italic">
                Em troca de 30 segundos por ano.
              </span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-4 md:text-right">
            Nada disso é nostalgia — é o que a Rural devolve por você ter mantido o cadastro vivo.
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
          {items.map(({ icon: Icon, title, copy, cta }, i) => (
            <article key={title} className="group relative bg-card p-7">
              <div className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-[18px]" />
              </div>
              <h3 className="mt-5 text-balance font-serif font-medium text-[20px] leading-[1.2] tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted-foreground">
                {copy}
              </p>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
              >
                {cta} <ArrowRight className="size-3" />
              </a>
              <span
                aria-hidden
                className="pointer-events-none absolute right-7 top-7 font-serif text-[12px] text-muted-foreground/50 tabular-nums"
              >
                0{i + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
