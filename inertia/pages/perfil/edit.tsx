import { Head, router } from '@inertiajs/react'
import { Award, Camera, GraduationCap, Lock, Mail } from 'lucide-react'
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react'

import { urlFor } from '~/client'
import AppLayout from '~/layouts/app'
import { PerfilRail, type PerfilSecao, type PerfilSecaoId } from '~/components/perfil/rail'
import { PerfilFoto } from '~/components/perfil/foto'
import { PerfilContato } from '~/components/perfil/contato'
import { PerfilAcademico } from '~/components/perfil/academico'
import { PerfilIds } from '~/components/perfil/ids'
import { PerfilPrivacidade } from '~/components/perfil/privacidade'
import { PerfilSaveBar } from '~/components/perfil/save_bar'
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

const SECOES: readonly PerfilSecao[] = [
  { id: 'foto', icon: Camera, label: 'Foto e identidade' },
  { id: 'contato', icon: Mail, label: 'Contato e local' },
  { id: 'academico', icon: GraduationCap, label: 'Vínculos acadêmicos' },
  { id: 'ids', icon: Award, label: 'Identificadores' },
  { id: 'privacidade', icon: Lock, label: 'Privacidade' },
] as const

/** Conta quantos dos 8 campos "públicos" estão preenchidos. */
function calcularPreenchidos(form: PerfilFormState, foto: string | null): number {
  const checks = [
    !!foto,
    !!form.headline.trim(),
    !!form.bio.trim(),
    !!form.telefone.trim(),
    !!form.cidade.trim(),
    !!form.lattes.trim(),
    !!form.orcid.trim(),
    !!form.linkedin.trim(),
  ]
  return checks.filter(Boolean).length
}

export default function PerfilEdit({ perfil, vinculos }: PageProps) {
  const inicial = useMemo(() => estadoInicialDoPerfil(perfil), [perfil])
  const [form, setForm] = useState<PerfilFormState>(inicial)
  const [foto, setFoto] = useState<string | null>(perfil.fotoUrl)
  const [ativo, setAtivo] = useState<PerfilSecaoId>('foto')
  const [processando, setProcessando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const ultimoSalvoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const set = <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setSalvo(false)
  }

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(inicial) || foto !== perfil.fotoUrl,
    [form, inicial, foto, perfil.fotoUrl]
  )

  const preenchidos = calcularPreenchidos(form, foto)

  /* scroll-spy: destaca a seção mais visível no rail */
  useEffect(() => {
    const elementos = SECOES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (elementos.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visivel) setAtivo(visivel.target.id as PerfilSecaoId)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    elementos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const irPara = (id: PerfilSecaoId) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const salvar = () => {
    setProcessando(true)
    router.put(urlFor('perfil.update'), payloadParaSalvar(form), {
      preserveScroll: true,
      onSuccess: () => {
        setSalvo(true)
        if (ultimoSalvoTimer.current) clearTimeout(ultimoSalvoTimer.current)
        ultimoSalvoTimer.current = setTimeout(() => setSalvo(false), 3500)
      },
      onFinish: () => setProcessando(false),
    })
  }

  const descartar = () => {
    setForm(inicial)
    setFoto(perfil.fotoUrl)
    setSalvo(false)
  }

  return (
    <>
      <Head title="Editar perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <PerfilRail
            secoes={SECOES}
            ativo={ativo}
            onIrPara={irPara}
            preenchidos={preenchidos}
            total={8}
          />
        </div>

        <div className="min-w-0 space-y-6 pb-24 lg:col-span-9">
          <div className="lg:hidden">
            <h1 className="font-semibold text-xl tracking-tight">Editar perfil</h1>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              Mantenha seus dados frescos — a UFRRJ usa só em análises agregadas.
            </p>
          </div>

          <PerfilFoto
            form={form}
            set={set}
            foto={foto}
            setFoto={(f) => {
              setFoto(f)
              setSalvo(false)
            }}
            iniciais={perfil.iniciais}
          />
          <PerfilContato form={form} set={set} emailLogin={perfil.emailLogin} />
          <PerfilAcademico vinculos={vinculos} />
          <PerfilIds form={form} set={set} />
          <PerfilPrivacidade form={form} set={set} />
        </div>
      </div>

      <PerfilSaveBar
        dirty={dirty}
        saved={salvo}
        processing={processando}
        onSalvar={salvar}
        onDescartar={descartar}
      />
    </>
  )
}

PerfilEdit.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>
