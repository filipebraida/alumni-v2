import { Head, useForm } from '@inertiajs/react'
import { ArrowRight, Eye } from 'lucide-react'
import { type ReactElement, useState } from 'react'
import { urlFor } from '~/client'
import FlowLayout from '~/layouts/flow'
import { CampoAtualizavel } from '~/components/respostas/campo_atualizavel'
import { FlowHeader } from '~/components/respostas/flow_header'
import { CAMPOS } from '~/components/respostas/types'
import { Button } from '~/components/ui/button'
import { type InertiaProps } from '~/types'
import type { Opcoes, RegistrarResposta, Status } from '~/components/respostas/types'

type PageProps = InertiaProps<{
  valores: RegistrarResposta
  opcoes: Opcoes
}>

export default function Atualizar({ valores, opcoes }: PageProps) {
  // useForm (não <Form>) porque o fluxo tem estado por campo (confirma/edita)
  // e um envio único ao final — não mapeia para inputs simples.
  const form = useForm<RegistrarResposta>(valores)
  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(CAMPOS.map((c) => [c.id, 'pendente' as Status]))
  )
  const [editando, setEditando] = useState<string | null>(null)

  const total = CAMPOS.length
  const prontos = Object.values(status).filter((s) => s !== 'pendente').length

  function confirmar(id: string) {
    setStatus((s) => ({ ...s, [id]: 'confirmado' }))
    setEditando(null)
  }

  function salvar(id: string, patch: Partial<RegistrarResposta>) {
    form.setData((data) => ({ ...data, ...patch }))
    setStatus((s) => ({ ...s, [id]: 'atualizado' }))
    setEditando(null)
  }

  function enviar() {
    form.post(urlFor('respostas.store'))
  }

  return (
    <>
      <Head title="Atualizar meus dados · SAE UFRRJ" />

      <FlowHeader prontos={prontos} total={total} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl tracking-tight">
            Confirme seus dados em ~30 segundos
          </h1>
          <p className="text-muted-foreground text-sm">
            {total} campos · diga “Sim, ainda” no que está certo, edite o que mudou. Pode pular o
            que quiser.
          </p>
        </div>

        <ul className="mt-5 space-y-2.5">
          {CAMPOS.map((campo) => (
            <li key={campo.id}>
              <CampoAtualizavel
                config={campo}
                data={form.data}
                opcoes={opcoes}
                status={status[campo.id]}
                editando={editando === campo.id}
                onConfirmar={() => confirmar(campo.id)}
                onEditar={() => setEditando(campo.id)}
                onSalvar={(patch) => salvar(campo.id, patch)}
                onCancelar={() => setEditando(null)}
              />
            </li>
          ))}
        </ul>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-muted-foreground text-xs">
          <Eye className="size-3.5" /> Esses dados aparecem só em análises agregadas — nunca
          individualizados.
        </p>
      </main>

      <div className="sticky bottom-0 border-t bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <span className="text-sm">
            <span className="font-semibold tabular-nums">{prontos}</span>{' '}
            <span className="text-muted-foreground">de {total} revisados</span>
          </span>
          <Button onClick={enviar} disabled={form.processing}>
            {form.processing ? 'Enviando…' : 'Concluir e enviar'} <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  )
}

Atualizar.layout = (page: ReactElement) => <FlowLayout>{page}</FlowLayout>
