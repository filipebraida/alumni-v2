import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { EgressosHero } from '~/components/portal/egressos/hero'
import { OQueVoceRecebe } from '~/components/portal/egressos/o-que-voce-recebe'
import { QuantoTempo } from '~/components/portal/egressos/quanto-tempo'
import { Historias } from '~/components/portal/egressos/historias'
import { PerguntasFrequentes } from '~/components/portal/egressos/perguntas-frequentes'
import { EgressosCTA } from '~/components/portal/egressos/cta'

export default function Egressos() {
  return (
    <>
      <Head title="Para egressos" />
      <EgressosHero />
      <OQueVoceRecebe />
      <QuantoTempo />
      <Historias />
      <PerguntasFrequentes />
      <EgressosCTA />
    </>
  )
}

Egressos.layout = (page: ReactElement) => <PortalLayout active="egressos">{page}</PortalLayout>
