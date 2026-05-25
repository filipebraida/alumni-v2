import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { UFRRJHero } from '~/components/portal/ufrrj/hero'
import { OQueDevolve } from '~/components/portal/ufrrj/o-que-devolve'
import { PapeisInstitucionais } from '~/components/portal/ufrrj/papeis-institucionais'
import { IntegracaoSistemas } from '~/components/portal/ufrrj/integracao-sistemas'
import { CalendarioAcademico } from '~/components/portal/ufrrj/calendario-academico'
import { UFRRJCTA } from '~/components/portal/ufrrj/cta'

export default function UFRRJ() {
  return (
    <>
      <Head title="Para a UFRRJ" />
      <UFRRJHero />
      <OQueDevolve />
      <PapeisInstitucionais />
      <IntegracaoSistemas />
      <CalendarioAcademico />
      <UFRRJCTA />
    </>
  )
}

UFRRJ.layout = (page: ReactElement) => <PortalLayout active="ufrrj">{page}</PortalLayout>
