import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { EntradaHero } from '~/components/portal/entrada/hero'
import { ComoFunciona } from '~/components/portal/entrada/como-funciona'
import { ReassuranceStrip } from '~/components/portal/entrada/reassurance-strip'

export default function Entrada() {
  return (
    <>
      <Head title="Portal de entrada" />
      <EntradaHero />
      <ComoFunciona />
      <ReassuranceStrip />
    </>
  )
}

Entrada.layout = (page: ReactElement) => <PortalLayout>{page}</PortalLayout>
