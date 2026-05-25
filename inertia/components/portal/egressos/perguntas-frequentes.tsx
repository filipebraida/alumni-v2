'use client'

import { ChevronDown } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { cn } from '~/lib/utils'

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: 'Como sei se a Coordenação já me cadastrou?',
    a: (
      <>
        A forma mais simples é tentar entrar com seu e-mail{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">@ufrrj.br</code>. Se você já
        está cadastrado, o link de acesso chega em segundos. Se não estiver, a tela vai oferecer o
        botão <em className="font-medium text-foreground not-italic">"Solicitar vínculo"</em> — é só
        preencher matrícula e ano de conclusão. A Coordenação aprova em até 5 dias úteis.
      </>
    ),
  },
  {
    q: 'Não tenho mais acesso ao meu e-mail @ufrrj.br. E agora?',
    a: (
      <>
        Acontece — especialmente pra quem se formou antes de 2018, quando o e-mail vitalício ainda
        não existia. Você pode pedir reativação no{' '}
        <a href="#" className="text-foreground underline underline-offset-4 hover:no-underline">
          portal da COINFO
        </a>{' '}
        (leva uns 3 dias). Ou, se preferir, abrir um ticket pelo SAE indicando um e-mail pessoal pra
        contato — vamos validar sua identidade com matrícula e CPF.
      </>
    ),
  },
  {
    q: 'Quem vê os meus dados, exatamente?',
    a: (
      <>
        Os dados <em className="font-medium text-foreground not-italic">individuais</em> só são
        vistos por você. A Coordenação do seu curso e a equipe do SAE veem apenas
        <em className="font-medium text-foreground not-italic"> agregados</em> — médias, medianas,
        distribuições. Os relatórios públicos têm mínimo de 5 respondentes por recorte (abaixo
        disso, o dado é suprimido). Ninguém — nem reitoria, nem MEC — recebe sua linha individual.
      </>
    ),
  },
  {
    q: 'Posso pedir pra sair?',
    a: (
      <>
        Pode, a qualquer momento, pelo seu próprio painel — opção{' '}
        <em className="font-medium text-foreground not-italic">"Excluir meus dados"</em> nas
        configurações. O pedido é processado em até 10 dias úteis e remove tudo, exceto o registro
        mínimo de que você é egresso (matrícula e curso) — isso a UFRRJ é obrigada a manter por lei.
      </>
    ),
  },
  {
    q: 'Por que vocês querem saber a minha faixa salarial?',
    a: (
      <>
        Pra responder uma pergunta concreta:{' '}
        <em className="font-medium text-foreground not-italic">o curso X prepara pro mercado?</em>{' '}
        Sem essa informação, a Coordenação não tem como revisar o currículo de forma honesta. Por
        isso é <em className="font-medium text-foreground not-italic">faixa</em>, nunca valor exato,
        e aparece sempre agregado por turma. Você também pode marcar "prefiro não dizer".
      </>
    ),
  },
  {
    q: 'O SAE manda muito e-mail?',
    a: (
      <>
        Um por ano, no mês do seu aniversário de formatura, pedindo a atualização. Mais um quando o
        relatório anual sai (pode silenciar). Mais o convite automático pros encontros de 5, 10, 20
        anos de turma.{' '}
        <strong className="font-medium text-foreground">Total: 2 a 3 e-mails por ano.</strong> Sem
        newsletter, sem marketing.
      </>
    ),
  },
]

export function PerguntasFrequentes() {
  const [open, setOpen] = useState(0)

  return (
    <section id="perguntas" className="bg-background">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 04 · Perguntas frequentes
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Tudo que a gente{' '}
              <span className="font-normal text-foreground/85 italic">mais escuta.</span>
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Não achou aqui? Escreve pra{' '}
              <a
                href="mailto:sae@prograd.ufrrj.br"
                className="text-foreground underline underline-offset-4 hover:no-underline"
              >
                sae@prograd.ufrrj.br
              </a>{' '}
              — alguém da equipe responde em até 2 dias úteis.
            </p>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="overflow-hidden rounded-2xl border bg-card">
              {faqs.map((f, i) => {
                const isOpen = open === i
                return (
                  <div key={f.q} className={cn(i > 0 && 'border-t')}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-start gap-5 px-7 py-6 text-left transition-colors hover:bg-muted/30"
                      aria-expanded={isOpen}
                    >
                      <span className="w-7 shrink-0 pt-1 font-serif text-[14px] font-medium leading-none text-primary tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-balance text-[16px] font-semibold leading-snug tracking-tight">
                        {f.q}
                      </span>
                      <span
                        className={cn(
                          'mt-1 grid size-6 shrink-0 place-items-center rounded-full border bg-background text-muted-foreground transition-transform',
                          isOpen && 'rotate-180 border-primary text-primary'
                        )}
                      >
                        <ChevronDown className="size-3.5" />
                      </span>
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="max-w-[58ch] text-pretty px-7 pb-7 pl-[78px] text-[15px] leading-relaxed text-muted-foreground">
                          {f.a}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
