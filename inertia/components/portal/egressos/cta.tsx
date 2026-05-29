import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, Leaf, User } from 'lucide-react'
import { PortalSection } from '~/components/portal/section'
import { SectionEyebrow } from '~/components/portal/section_eyebrow'
import { SectionHeading } from '~/components/portal/section_heading'
import { buttonVariants } from '~/components/ui/button'

export function EgressosCta() {
  return (
    <PortalSection surface="muted" border="top">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid grid-cols-12">
          <div className="relative col-span-12 p-10 md:col-span-7 md:p-14">
            <SectionEyebrow>Última parada</SectionEyebrow>
            <SectionHeading className="mt-3">Pronto pra entrar?</SectionHeading>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Vai levar 30 segundos. Não vai pedir senha. Você pode sair na metade e voltar depois —
              a gente guarda onde parou.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#login" className={buttonVariants({ size: 'lg' })}>
                Entrar com @ufrrj.br
                <ArrowRight />
              </Link>
              <a href="#" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                <User />
                Solicitar vínculo
              </a>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-8 select-none font-serif text-9xl font-medium leading-none text-primary/5"
            >
              R
            </div>
          </div>

          <div className="col-span-12 flex flex-col bg-primary p-10 text-primary-foreground md:col-span-5 md:p-12">
            <Leaf className="size-6 text-brand-yellow" />
            <blockquote className="mt-6 text-pretty font-serif text-2xl leading-snug tracking-tight">
              “Tem coisa que só faz sentido se a gente continuar contando. A UFRRJ tem mais de cem
              anos. Vamos seguir contando juntos.”
            </blockquote>
            <div className="mt-auto border-t border-primary-foreground/15 pt-8">
              <div className="text-sm font-semibold">Profa. Marília Almeida</div>
              <div className="mt-0.5 text-xs text-primary-foreground/70">
                Coordenadora do SAE · PROGRAD/UFRRJ
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalSection>
  )
}
