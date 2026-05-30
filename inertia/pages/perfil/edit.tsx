import { Head, router } from '@inertiajs/react'
import { type ReactElement, useMemo, useRef, useState } from 'react'

import { urlFor } from '~/client'
import AppLayout from '~/layouts/app'
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
import { PerfilFoto } from '~/components/perfil/foto'
import { PerfilIds } from '~/components/perfil/ids'
import { PerfilPrivacidade } from '~/components/perfil/privacidade'
import { PerfilRail } from '~/components/perfil/rail'
import { PerfilSaveBar } from '~/components/perfil/save_bar'
import { contarPreenchidos, useSecaoAtiva } from '~/components/perfil/secoes'
import {
  type Perfil,
  type PerfilFormState,
  type Vinculo,
  estadoInicialDoPerfil,
  payloadParaSalvar,
} from '~/components/perfil/types'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  perfil: Perfil
  vinculos: Vinculo[]
}>

export default function PerfilEdit({ perfil, vinculos }: PageProps) {
  const formApi = usePerfilForm(perfil)
  const ativo = useSecaoAtiva()
  const preenchidos = contarPreenchidos(formApi.form, formApi.foto)

  return (
    <>
      <Head title="Editar perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <PerfilRail
            titulo="Editar perfil"
            descricao="Mantenha seus dados frescos — a UFRRJ usa só em análises agregadas."
            ativo={ativo}
            preenchidos={preenchidos}
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
          <PerfilAcademico vinculos={vinculos} />
          <PerfilIds form={formApi.form} set={formApi.set} />
          <PerfilPrivacidade form={formApi.form} set={formApi.set} />
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
    </>
  )
}

PerfilEdit.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

/**
 * Hook que encapsula o estado do formulário, dirty tracking, ações de
 * salvar/descartar/voltar e o flash de "salvo". Mantém o componente
 * principal focado no layout.
 */
function usePerfilForm(perfil: Perfil) {
  const inicial = useMemo(() => estadoInicialDoPerfil(perfil), [perfil])
  const [form, setForm] = useState<PerfilFormState>(inicial)
  const [foto, setFotoState] = useState<string | null>(perfil.fotoUrl)
  const [processando, setProcessando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const set = <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setSalvo(false)
  }

  const setFoto = (f: string | null) => {
    setFotoState(f)
    setSalvo(false)
  }

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(inicial) || foto !== perfil.fotoUrl,
    [form, inicial, foto, perfil.fotoUrl]
  )

  const salvar = () => {
    setProcessando(true)
    router.put(urlFor('perfil.update'), payloadParaSalvar(form), {
      preserveScroll: true,
      onSuccess: () => {
        setSalvo(true)
        if (flashTimer.current) clearTimeout(flashTimer.current)
        flashTimer.current = setTimeout(() => setSalvo(false), 3500)
      },
      onFinish: () => setProcessando(false),
    })
  }

  const descartar = () => {
    setForm(inicial)
    setFotoState(perfil.fotoUrl)
    setSalvo(false)
  }

  const voltar = () => {
    if (dirty) setConfirmandoSaida(true)
    else router.visit(urlFor('perfil.show'))
  }

  const sairSemSalvar = () => {
    setConfirmandoSaida(false)
    router.visit(urlFor('perfil.show'))
  }

  return {
    form,
    set,
    foto,
    setFoto,
    dirty,
    salvo,
    processando,
    salvar,
    descartar,
    voltar,
    sairSemSalvar,
    confirmandoSaida,
    setConfirmandoSaida,
  }
}
