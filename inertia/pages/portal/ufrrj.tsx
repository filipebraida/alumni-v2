import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { UfrrjHero } from '~/components/portal/ufrrj/hero'
import { UfrrjContrapartida } from '~/components/portal/ufrrj/contrapartida'
import { UfrrjPapeis } from '~/components/portal/ufrrj/papeis'
import { UfrrjIntegracoes } from '~/components/portal/ufrrj/integracoes'
import { UfrrjCalendario } from '~/components/portal/ufrrj/calendario'
import { UfrrjCta } from '~/components/portal/ufrrj/cta'

export default function UFRRJ() {
  return (
    <>
      <Head title="Para a UFRRJ" />
      <UfrrjHero />
      <UfrrjContrapartida />
      <UfrrjPapeis />
      <UfrrjIntegracoes />
      <UfrrjCalendario />
      <UfrrjCta />
    </>
  )
}

UFRRJ.layout = (page: ReactElement) => <PortalLayout active="ufrrj">{page}</PortalLayout>
