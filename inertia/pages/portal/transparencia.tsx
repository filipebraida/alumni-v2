import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { TransHero } from '~/components/portal/transparencia/hero'
import { RelatoriosPublicados } from '~/components/portal/transparencia/relatorios-publicados'
import { ComoAnonimizamos } from '~/components/portal/transparencia/como-anonimizamos'
import { AcessoMatriz } from '~/components/portal/transparencia/acesso-matriz'
import { RegistroLAI } from '~/components/portal/transparencia/registro-lai'
import { TransCTA } from '~/components/portal/transparencia/cta'

export default function Transparencia() {
  return (
    <>
      <Head title="Transparência" />
      <TransHero />
      <RelatoriosPublicados />
      <ComoAnonimizamos />
      <AcessoMatriz />
      <RegistroLAI />
      <TransCTA />
    </>
  )
}

Transparencia.layout = (page: ReactElement) => (
  <PortalLayout active="transparencia">{page}</PortalLayout>
)
