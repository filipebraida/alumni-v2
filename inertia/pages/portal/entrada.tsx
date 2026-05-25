import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { EntradaHero } from '~/components/portal/entrada/hero'
import { EntradaPassos } from '~/components/portal/entrada/passos'
import { EntradaGarantias } from '~/components/portal/entrada/garantias'

export default function Entrada() {
  return (
    <>
      <Head title="Portal de entrada" />
      <EntradaHero />
      <EntradaPassos />
      <EntradaGarantias />
    </>
  )
}

Entrada.layout = (page: ReactElement) => <PortalLayout>{page}</PortalLayout>
