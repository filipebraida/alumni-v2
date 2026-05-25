import { ReactNode } from 'react'

function Princ({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[36px_1fr] gap-5 border-t border-primary-foreground/15 pt-4 first:border-t-0 first:pt-0">
      <span className="font-serif font-medium text-[24px] leading-none text-brand-yellow tabular-nums">
        {n}
      </span>
      <div>
        <h3 className="text-[16px] font-semibold leading-snug tracking-tight">{title}</h3>
        <p className="mt-1 text-pretty text-[14px] leading-relaxed text-primary-foreground/75">
          {children}
        </p>
      </div>
    </div>
  )
}

export function Metodologia() {
  return (
    <section className="border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
              § 05 · Metodologia
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Dados que servem,{' '}
              <span className="font-normal italic opacity-90">sem cruzar a linha.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-primary-foreground/80">
              O SAE coleta o mínimo necessário, anonimiza no agregado e publica o que faz —
              inclusive os erros. Tudo seguindo a LGPD e o termo de consentimento assinado pelo
              egresso no primeiro acesso.
            </p>
          </div>

          <div className="col-span-12 space-y-3.5 md:col-span-7">
            <Princ n="A" title="Mínimo dado, máximo cuidado.">
              8 campos por egresso. Faixa salarial (nunca o valor exato). CEP (nunca o endereço).
              Ocupação textual livre — analisada por código CBO de forma anônima.
            </Princ>
            <Princ n="B" title="Anonimização no agregado.">
              Relatórios públicos sempre por curso e por coorte, com mínimo de 5 respondentes por
              recorte. Abaixo disso, o dado é suprimido para evitar reidentificação.
            </Princ>
            <Princ n="C" title="Transparência ativa.">
              Relatório anual publicado no site institucional, com microdados anonimizados em CSV.
              Você pode ver — e baixar — o que foi feito com sua participação.
            </Princ>
            <Princ n="D" title="Direito ao esquecimento.">
              Qualquer egresso pode pedir exclusão total dos seus dados a qualquer momento, pelo
              painel ou por e-mail. Resposta em até 10 dias úteis.
            </Princ>
          </div>
        </div>
      </div>
    </section>
  )
}
