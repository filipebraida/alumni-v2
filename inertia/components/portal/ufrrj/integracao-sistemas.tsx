import { Check, Eye, LucideIcon, RefreshCw } from 'lucide-react'

const inputs = [
  { name: 'SIGAA', desc: 'Vínculo · matrícula · curso' },
  { name: 'Egresso', desc: '8 dados por ano · consentido' },
  { name: 'PROGRAD', desc: 'Calendário · políticas' },
]

const outputs = [
  { name: 'Sinaes / MEC', desc: 'Renovação de reconhecimento' },
  { name: 'NDE / Coord', desc: 'Painel · reforma do PPC' },
  { name: 'CPA / Reitoria', desc: 'Autoavaliação · relato' },
  { name: 'Público', desc: 'Relatório anual aberto' },
]

function FlowArrow() {
  return (
    <svg width="80" height="14" viewBox="0 0 80 14" className="text-border" aria-hidden>
      <path
        d="M 2 7 H 70 M 64 2 L 70 7 L 64 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 3"
      />
    </svg>
  )
}

function IntegraTag({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span>{text}</span>
    </div>
  )
}

function FlowList({ title, items }: { title: string; items: { name: string; desc: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.name} className="rounded-lg border bg-background p-3.5">
            <div className="text-[13px] font-semibold tracking-tight">{it.name}</div>
            <div className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{it.desc}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function IntegracaoSistemas() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 03 · Integração
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Não é <span className="font-normal text-foreground/85 italic">mais um sistema.</span>
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              O SAE conversa com os sistemas que a Universidade já usa. Você entra com o mesmo
              usuário do SIGAA, e o que sai do SAE já vem no formato que o MEC pede.
            </p>

            <div className="mt-7 rounded-xl border bg-card p-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Tempo de adesão
              </div>
              <div className="mt-2 font-serif font-medium text-[28px] text-primary tabular-nums">
                ~ 3 dias úteis
              </div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                Da solicitação à liberação do painel pra Coordenação. Sem instalação. Sem requisição
                na TI.
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="relative rounded-2xl border bg-card p-8">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8">
                <FlowList title="Entra" items={inputs} />

                <div className="flex flex-col items-center">
                  <FlowArrow />
                  <div className="relative my-3 grid size-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <div className="text-center">
                      <div className="font-serif font-medium text-[22px] leading-none">SAE</div>
                      <div className="mt-1 text-[9px] uppercase tracking-[0.18em] opacity-80">
                        núcleo
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-card bg-brand-yellow"
                    />
                  </div>
                  <FlowArrow />
                </div>

                <FlowList title="Sai" items={outputs} />
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t pt-5 text-[12px] text-muted-foreground">
                <IntegraTag icon={Check} text="LGPD · termo de consentimento ativo" />
                <IntegraTag icon={RefreshCw} text="Sincronização diária com SIGAA" />
                <IntegraTag icon={Eye} text="Auditoria de acesso por papel" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
