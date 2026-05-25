import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'
import PortalLayout from '~/layouts/portal'
import { TransparenciaHero } from '~/components/portal/transparencia/hero'
import { TransparenciaRelatorios } from '~/components/portal/transparencia/relatorios'
import { TransparenciaAnonimizacao } from '~/components/portal/transparencia/anonimizacao'
import { TransparenciaMatrizAcesso } from '~/components/portal/transparencia/matriz_acesso'
import { TransparenciaRegistroLai } from '~/components/portal/transparencia/registro_lai'
import { TransparenciaCta } from '~/components/portal/transparencia/cta'

export default function Transparencia() {
  return (
    <>
      <Head title="Transparência" />
      <TransparenciaHero />
      <TransparenciaRelatorios />
      <TransparenciaAnonimizacao />
      <TransparenciaMatrizAcesso />
      <TransparenciaRegistroLai />
      <TransparenciaCta />
    </>
  )
}

Transparencia.layout = (page: ReactElement) => (
  <PortalLayout active="transparencia">{page}</PortalLayout>
)
