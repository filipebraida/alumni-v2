import { Link } from '@adonisjs/inertia/react'
import { ArrowLeftIcon } from 'lucide-react'

import { urlFor } from '~/client'
import { PortalContainer } from '~/components/portal/container'
import { PortalLogo } from '~/components/portal/logo'

/**
 * Top bar enxuto pro perfil dentro da área de gestão: marca + link de volta
 * pra gestão. Sem sidebar nem nav primário — é uma tela focada (a pessoa
 * está cuidando do próprio perfil, não navegando o sistema). O `GestaoLayout`
 * com sidebar volta assim que clica em "Voltar para gestão".
 */
export function PerfilGestaoTopbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <PortalContainer className="flex h-16 items-center gap-3 sm:gap-6">
        <Link route="gestao.show" className="flex items-center gap-2.5">
          <PortalLogo />
          <span className="font-semibold text-sm tracking-tight">
            SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
          </span>
        </Link>
        <Link
          href={urlFor('gestao.show')}
          className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          <span className="hidden sm:inline">Voltar para gestão</span>
          <span className="sm:hidden">Gestão</span>
        </Link>
      </PortalContainer>
    </header>
  )
}
