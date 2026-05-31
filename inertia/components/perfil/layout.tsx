import { type ReactNode } from 'react'

import AppLayout from '~/layouts/app'
import FlowLayout from '~/layouts/flow'
import { PerfilGestaoTopbar } from '~/components/perfil/gestao_topbar'

type Props = {
  /** User tem matrícula? → top bar do egresso. Sem matrícula → top bar enxuto. */
  temEgresso: boolean
  children: ReactNode
}

/**
 * Escolhe o shell apropriado pro perfil:
 * - egresso → `AppLayout` (top bar com nav primário do egresso)
 * - admin/coordenador → `FlowLayout` + top bar enxuto (logo + voltar pra
 *   gestão). Sem sidebar — é uma tela focada (o user tá cuidando do próprio
 *   perfil, não navegando a área).
 *
 * Mesma URL `/perfil` pra todo mundo; o shell muda pelo papel do user.
 */
export function PerfilLayout({ temEgresso, children }: Props) {
  if (temEgresso) {
    return <AppLayout>{children as React.ReactElement}</AppLayout>
  }
  return (
    <FlowLayout>
      <>
        <PerfilGestaoTopbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </>
    </FlowLayout>
  )
}
