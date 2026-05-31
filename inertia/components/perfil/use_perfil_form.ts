import { router } from '@inertiajs/react'
import { useMemo, useRef, useState } from 'react'

import {
  type Perfil,
  type PerfilFormState,
  estadoInicialDoPerfil,
  payloadParaSalvar,
} from '~/components/perfil/types'

type Routes = {
  /** URL para o `router.put` (ex: `urlFor('perfil.update')`). */
  update: string
  /** URL para onde Voltar / depois de Descartar (ex: `urlFor('perfil.show')`). */
  voltar: string
}

/**
 * Encapsula o estado do formulário de perfil (form + foto), dirty tracking,
 * ações (salvar/descartar/voltar) e o flash de "salvo". Reusado entre os
 * dois fluxos de edit (egresso `/perfil/editar` e gestão `/gestao/perfil/editar`)
 * — só muda a URL pra onde envia e pra onde volta.
 */
export function usePerfilForm(perfil: Perfil, routes: Routes) {
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
    router.put(routes.update, payloadParaSalvar(form), {
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
    else router.visit(routes.voltar)
  }

  const sairSemSalvar = () => {
    setConfirmandoSaida(false)
    router.visit(routes.voltar)
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
