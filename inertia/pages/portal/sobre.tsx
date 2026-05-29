import { Head } from '@inertiajs/react'
import { type ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { SobreHero } from '~/components/portal/sobre/hero'
import { SobreProposito } from '~/components/portal/sobre/proposito'
import { SobreAtuacao } from '~/components/portal/sobre/atuacao'
import { SobreHistorico } from '~/components/portal/sobre/historico'
import { SobreEquipe } from '~/components/portal/sobre/equipe'
import { SobreMetodologia } from '~/components/portal/sobre/metodologia'
import { SobreCta } from '~/components/portal/sobre/cta'

export default function Sobre() {
  return (
    <>
      <Head title="Sobre o SAE" />
      <SobreHero />
      <SobreProposito />
      <SobreAtuacao />
      <SobreHistorico />
      <SobreEquipe />
      <SobreMetodologia />
      <SobreCta />
    </>
  )
}

Sobre.layout = (page: ReactElement) => <PortalLayout active="sobre">{page}</PortalLayout>
