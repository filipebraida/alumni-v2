import { useState } from 'react'
import { EntradaLoginCoordForm } from '~/components/portal/entrada/login_coord_form'
import { EntradaLoginEgressoForm } from '~/components/portal/entrada/login_egresso_form'
import { Tabs, TabsList, TabsPanel, TabsTab } from '~/components/ui/tabs'

/**
 * Sign-in card on the portal landing page. Switches between the egresso and
 * coordination flows; each flow lives in its own component.
 */
export function EntradaLoginCard() {
  const [tab, setTab] = useState('egresso')

  return (
    <div className="relative rounded-2xl border bg-card p-7 shadow-sm">
      <span className="absolute -top-2 right-6 inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <span className="inline-block size-1.5 rounded-full bg-brand-yellow" />
        Acesso ao SAE
      </span>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Acesse seu painel</h2>
        <p className="text-sm text-muted-foreground">
          {tab === 'egresso'
            ? 'Use o e-mail @ufrrj.br cadastrado pela sua Coordenação.'
            : 'Login institucional de coordenadores e servidores.'}
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className="mt-5">
        <TabsList className="w-full">
          <TabsTab value="egresso">Egresso</TabsTab>
          <TabsTab value="coord">Coordenação</TabsTab>
        </TabsList>
        <TabsPanel value="egresso" className="mt-5">
          <EntradaLoginEgressoForm />
        </TabsPanel>
        <TabsPanel value="coord" className="mt-5">
          <EntradaLoginCoordForm />
        </TabsPanel>
      </Tabs>
    </div>
  )
}
