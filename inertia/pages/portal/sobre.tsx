import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { SobreHero } from '~/components/portal/sobre/hero'
import { PorQueExiste } from '~/components/portal/sobre/por-que-existe'
import { OQueFazemos } from '~/components/portal/sobre/o-que-fazemos'
import { LinhaDoTempo } from '~/components/portal/sobre/linha-do-tempo'
import { QuemMantem } from '~/components/portal/sobre/quem-mantem'
import { Metodologia } from '~/components/portal/sobre/metodologia'
import { SobreCTA } from '~/components/portal/sobre/cta'

export default function Sobre() {
  return (
    <>
      <Head title="Sobre o SAE" />
      <SobreHero />
      <PorQueExiste />
      <OQueFazemos />
      <LinhaDoTempo />
      <QuemMantem />
      <Metodologia />
      <SobreCTA />
    </>
  )
}

Sobre.layout = (page: ReactElement) => <PortalLayout active="sobre">{page}</PortalLayout>
