import { Head } from '@inertiajs/react'
import { useMemo } from 'react'

import { urlFor } from '~/client'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '~/components/ui/alert_dialog'
import { Button } from '~/components/ui/button'
import { PerfilAcademico } from '~/components/perfil/academico'
import { PerfilContato } from '~/components/perfil/contato'
import { PerfilCoordenacao } from '~/components/perfil/coordenacao'
import { PerfilFoto } from '~/components/perfil/foto'
import { PerfilIds } from '~/components/perfil/ids'
import { PerfilLayout } from '~/components/perfil/layout'
import { PerfilPrivacidade } from '~/components/perfil/privacidade'
import { PerfilRail } from '~/components/perfil/rail'
import { PerfilSaveBar } from '~/components/perfil/save_bar'
import { contarPreenchidos, secoesParaPerfil, useSecaoAtiva } from '~/components/perfil/secoes'
import { usePerfilForm } from '~/components/perfil/use_perfil_form'
import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  // `usuario` (não `perfil`) pra não colidir com o `perfil` flags do
  // InertiaMiddleware.share (isEgresso/isGestor/isAdmin).
  usuario: Data.User.Variants['forPerfil']
  egresso: Data.Egresso.Variants['forPerfil'] | null
  gestor: Data.Gestor.Variants['forPerfil'] | null
}>

export default function PerfilEdit({ usuario: perfil, egresso, gestor }: PageProps) {
  const formApi = usePerfilForm(perfil, {
    update: urlFor('perfil.update'),
    voltar: urlFor('perfil.show'),
  })
  const secoes = useMemo(
    () => secoesParaPerfil({ temEgresso: !!egresso, temGestor: !!gestor }),
    [egresso, gestor]
  )
  const ativo = useSecaoAtiva(secoes)
  const preenchidos = contarPreenchidos(formApi.form, formApi.foto)

  return (
    <PerfilLayout temEgresso={!!egresso}>
      <Head title="Editar perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <PerfilRail
            titulo="Editar perfil"
            descricao="Mantenha seus dados frescos — a UFRRJ usa só em análises agregadas."
            ativo={ativo}
            preenchidos={preenchidos}
            secoes={secoes}
          />
        </div>

        <div className="min-w-0 space-y-6 pb-32 lg:col-span-9">
          <div className="lg:hidden">
            <h1 className="font-semibold text-xl tracking-tight">Editar perfil</h1>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              Mantenha seus dados frescos — a UFRRJ usa só em análises agregadas.
            </p>
          </div>

          <PerfilFoto
            form={formApi.form}
            set={formApi.set}
            foto={formApi.foto}
            setFoto={formApi.setFoto}
            iniciais={perfil.iniciais}
          />
          <PerfilContato form={formApi.form} set={formApi.set} emailLogin={perfil.emailLogin} />
          {egresso && <PerfilAcademico vinculos={egresso.vinculos} />}
          {gestor && <PerfilCoordenacao gestor={gestor} />}
          <PerfilIds form={formApi.form} set={formApi.set} />
          {egresso && <PerfilPrivacidade form={formApi.form} set={formApi.set} />}
        </div>
      </div>

      <PerfilSaveBar
        dirty={formApi.dirty}
        saved={formApi.salvo}
        processing={formApi.processando}
        onSalvar={formApi.salvar}
        onDescartar={formApi.descartar}
        onVoltar={formApi.voltar}
      />

      <AlertDialog open={formApi.confirmandoSaida} onOpenChange={formApi.setConfirmandoSaida}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair sem salvar?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas. Se sair agora, elas serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="outline" />}>
              Continuar editando
            </AlertDialogClose>
            <Button variant="destructive" onClick={formApi.sairSemSalvar}>
              Sair sem salvar
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </PerfilLayout>
  )
}
