import { type ReactNode } from 'react'
import { PortalContainer } from '~/components/portal/container'
import { PortalLogo } from '~/components/portal/logo'

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="text-xs uppercase tracking-widest text-white/40">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ children }: { children: ReactNode }) {
  return (
    <li>
      <a href="#" className="text-white/80 hover:text-white">
        {children}
      </a>
    </li>
  )
}

/** Shared dark institutional footer for the public portal. */
export function PortalFooter() {
  return (
    <footer className="border-t bg-portal-ink text-portal-ink-foreground">
      <PortalContainer className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <PortalLogo onDark />
              <span className="font-semibold text-sm tracking-tight">SAE · UFRRJ</span>
            </div>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-white/70">
              Serviço de Acompanhamento de Egressos da Universidade Federal Rural do Rio de Janeiro.
              Mantido pela Pró-Reitoria de Graduação.
            </p>
            <p className="mt-6 text-xs text-white/50">
              Rod. BR-465, km 7 · Seropédica, RJ · 23890-000
            </p>
          </div>

          <FooterCol title="O serviço">
            <FooterLink>Sobre o SAE</FooterLink>
            <FooterLink>Metodologia</FooterLink>
            <FooterLink>Conformidade com MEC</FooterLink>
            <FooterLink>Relatórios públicos</FooterLink>
          </FooterCol>

          <FooterCol title="Para egressos">
            <FooterLink>Por que participar</FooterLink>
            <FooterLink>Perguntas frequentes</FooterLink>
            <FooterLink>Política de privacidade</FooterLink>
            <FooterLink>Excluir meus dados</FooterLink>
          </FooterCol>

          <FooterCol title="UFRRJ">
            <FooterLink>ufrrj.br ↗</FooterLink>
            <FooterLink>PROGRAD ↗</FooterLink>
            <FooterLink>SIGAA ↗</FooterLink>
            <FooterLink>Fala.BR ↗</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center">
          <span>© 2026 UFRRJ · Pró-Reitoria de Graduação</span>
        </div>
      </PortalContainer>
    </footer>
  )
}
