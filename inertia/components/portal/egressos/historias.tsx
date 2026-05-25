import { PortalSection } from '~/components/portal/section'
import { SectionHeader } from '~/components/portal/section_header'
import { SoftBadge } from '~/components/portal/soft_badge'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'

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

export function EgressosHistorias() {
  return (
    <PortalSection surface="muted" border="both">
      <SectionHeader
        eyebrow="§ 03 · Histórias"
        aside={
          <>
            Recortes reais, com permissão.
            <br className="hidden md:block" />
            Nomes preservados a pedido.
          </>
        }
      >
        Coisas que aconteceram{' '}
        <span className="font-normal italic text-foreground/85">
          porque alguém manteve o cadastro.
        </span>
      </SectionHeader>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((it) => (
          <article key={it.who} className="flex flex-col rounded-2xl border bg-card p-7 shadow-sm">
            <SoftBadge tone="yellow" className="mb-5 self-start">
              {it.tag}
            </SoftBadge>
            <blockquote className="text-pretty font-serif text-lg leading-relaxed tracking-tight text-foreground">
              {it.quote}
            </blockquote>
            <div className="mt-auto flex items-center gap-3 border-t pt-6">
              <Avatar className="size-10 bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initials(it.who)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">{it.who}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{it.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PortalSection>
  )
}
