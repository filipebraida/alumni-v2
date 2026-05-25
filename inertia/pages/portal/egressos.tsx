import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { EgressosHero } from '~/components/portal/egressos/hero'
import { EgressosBeneficios } from '~/components/portal/egressos/beneficios'
import { EgressosEsforco } from '~/components/portal/egressos/esforco'
import { EgressosHistorias } from '~/components/portal/egressos/historias'
import { EgressosFaq } from '~/components/portal/egressos/faq'
import { EgressosCta } from '~/components/portal/egressos/cta'

export default function Egressos() {
  return (
    <>
      <Head title="Para egressos" />
      <EgressosHero />
      <EgressosBeneficios />
      <EgressosEsforco />
      <EgressosHistorias />
      <EgressosFaq />
      <EgressosCta />
    </>
  )
}

Egressos.layout = (page: ReactElement) => <PortalLayout active="egressos">{page}</PortalLayout>
