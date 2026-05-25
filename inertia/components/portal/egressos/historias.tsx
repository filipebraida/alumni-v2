import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { SoftBadge } from '~/components/portal/soft-badge'

const items = [
  {
    quote:
      '"Atualizei meu cadastro em 2022 só pra cumprir tabela. Em 2023 fui chamada por uma colega que viu meu CEP no SAE e tinha uma vaga aqui em Floripa. Estou empregada por conta dela."',
    who: 'Renata C.',
    role: 'Med. Veterinária · turma 2018',
    tag: 'Indicação por colega',
  },
  {
    quote:
      '"Pedi declaração de conclusão pelo SAE numa quinta às 23h. Sexta de manhã estava no meu e-mail, assinada digitalmente. Concorri pro mestrado com ela no mesmo dia."',
    who: 'Bruno L.',
    role: 'Agronomia · turma 2016',
    tag: 'Declaração em 1 clique',
  },
  {
    quote:
      '"Como mentor, recebo 1 ou 2 pedidos por semestre. São 30 minutos por café, sempre alguém da Rural. É o que eu queria ter tido quando me formei em 2009."',
    who: 'Diogo M.',
    role: 'Ciência da Computação · 2009',
    tag: 'Mentor voluntário',
  },
]

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

export function Historias() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-[1320px] px-8 py-20">
        <div className="grid grid-cols-12 items-end gap-10">
          <div className="col-span-12 md:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              § 03 · Histórias
            </div>
            <h2 className="mt-2 text-balance font-serif font-medium text-[40px] leading-[1.08] tracking-[-0.015em]">
              Coisas que aconteceram{' '}
              <span className="font-normal text-foreground/85 italic">
                porque alguém manteve o cadastro.
              </span>
            </h2>
          </div>
          <div className="col-span-12 text-sm text-muted-foreground md:col-span-5 md:text-right">
            Recortes reais, com permissão.
            <br className="hidden md:block" />
            Nomes preservados a pedido.
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <article
              key={it.who}
              className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm"
            >
              <SoftBadge tone="yellow" className="mb-5 self-start">
                {it.tag}
              </SoftBadge>
              <blockquote className="text-pretty font-serif text-[18px] leading-[1.45] tracking-[-0.005em] text-foreground">
                {it.quote}
              </blockquote>
              <div className="mt-auto flex items-center gap-3 border-t pt-6">
                <Avatar className="size-10 bg-primary/10">
                  <AvatarFallback className="bg-primary/10 text-[12px] font-semibold text-primary">
                    {initials(it.who)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold leading-tight">{it.who}</div>
                  <div className="mt-0.5 text-[12px] text-muted-foreground">{it.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
