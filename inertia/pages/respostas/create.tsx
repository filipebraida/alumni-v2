import { Head, useForm } from '@inertiajs/react'
import { ArrowRight, Eye, GraduationCap } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'
import { type Data } from '@generated/data'
import { urlFor } from '~/client'
import FlowLayout from '~/layouts/flow'
import {
  CampoAtualizavel,
  type CampoConfig,
  type Status,
} from '~/components/respostas/campo_atualizavel'
import { FlowHeader } from '~/components/respostas/flow_header'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { type InertiaProps } from '~/types'

type ValoresGerais = Data.RespostaPessoa.Variants['forRevisao']
type MatriculaItem = Data.Matricula.Variants['forRevisao']
type ValoresMatricula = NonNullable<MatriculaItem['valoresAtuais']>

export type Opcao = { valor: string; rotulo: string }
export type Opcoes = {
  setor: Opcao[]
  faixaSalarial: Opcao[]
  relacaoFormacao: Opcao[]
  tempoPrimeiroEmprego: Opcao[]
}

const CAMPOS_GERAIS: CampoConfig[] = [
  {
    id: 'localizacao',
    icone: 'pin',
    rotulo: 'Onde você mora',
    editor: 'local',
    ajuda: 'Cidade e estado.',
  },
  {
    id: 'empregador',
    icone: 'briefcase',
    rotulo: 'Empresa ou instituição',
    editor: 'texto',
    campo: 'empregador',
  },
  { id: 'cargo', icone: 'star', rotulo: 'Cargo / função', editor: 'texto', campo: 'cargo' },
  {
    id: 'setor',
    icone: 'flag',
    rotulo: 'Setor de atuação',
    editor: 'opcoes',
    campo: 'setor',
    opcoesKey: 'setor',
  },
  {
    id: 'faixaSalarial',
    icone: 'chart',
    rotulo: 'Faixa salarial',
    editor: 'opcoes',
    campo: 'faixaSalarial',
    opcoesKey: 'faixaSalarial',
    ajuda: 'Usada só em agregado, nunca individual.',
  },
]

const CAMPOS_MATRICULA: CampoConfig[] = [
  {
    id: 'relacaoFormacao',
    icone: 'check',
    rotulo: 'Atua na área formada?',
    editor: 'opcoes',
    campo: 'relacaoFormacao',
    opcoesKey: 'relacaoFormacao',
  },
  {
    id: 'tempoPrimeiroEmprego',
    icone: 'clock',
    rotulo: 'Tempo até o 1º emprego',
    editor: 'opcoes',
    campo: 'tempoPrimeiroEmprego',
    opcoesKey: 'tempoPrimeiroEmprego',
  },
]

type FormShape = ValoresGerais & {
  matriculas: Array<{ id: number } & ValoresMatricula>
}

type PageProps = InertiaProps<{
  valores: ValoresGerais
  matriculas: MatriculaItem[]
  opcoes: Opcoes
}>

const keyGeral = (id: string) => `gerais:${id}`
const keyMatricula = (mid: number, id: string) => `m${mid}:${id}`

export default function RespostasCreate({ valores, matriculas, opcoes }: PageProps) {
  // useForm (não <Form>) — fluxo tem estado por card (confirma/edita) e envio
  // único ao final; não mapeia pra inputs simples.
  const form = useForm<FormShape>({
    ...valores,
    matriculas: matriculas.map((m) => ({
      id: m.id,
      relacaoFormacao: m.valoresAtuais?.relacaoFormacao ?? null,
      tempoPrimeiroEmprego: m.valoresAtuais?.tempoPrimeiroEmprego ?? null,
    })),
  })

  const cardKeys = useMemo(() => {
    const gerais = CAMPOS_GERAIS.map((c) => keyGeral(c.id))
    const porMatricula = matriculas
      .filter((m) => m.ehGraduacao)
      .flatMap((m) => CAMPOS_MATRICULA.map((c) => keyMatricula(m.id, c.id)))
    return [...gerais, ...porMatricula]
  }, [matriculas])

  const [status, setStatus] = useState<Record<string, Status>>(() =>
    Object.fromEntries(cardKeys.map((k) => [k, 'pendente' as Status]))
  )
  const [editando, setEditando] = useState<string | null>(null)

  const total = cardKeys.length
  const prontos = Object.values(status).filter((s) => s !== 'pendente').length

  function confirmar(key: string) {
    setStatus((s) => ({ ...s, [key]: 'confirmado' }))
    setEditando(null)
  }

  function salvarGeral(key: string, patch: Partial<ValoresGerais>) {
    form.setData((d) => ({ ...d, ...patch }))
    setStatus((s) => ({ ...s, [key]: 'atualizado' }))
    setEditando(null)
  }

  function salvarMatricula(key: string, idx: number, patch: Partial<ValoresMatricula>) {
    form.setData((d) => ({
      ...d,
      matriculas: d.matriculas.map((m, i) => (i === idx ? { ...m, ...patch } : m)),
    }))
    setStatus((s) => ({ ...s, [key]: 'atualizado' }))
    setEditando(null)
  }

  function enviar() {
    form.post(urlFor('respostas.store'))
  }

  // Slice de form.data sem o array `matriculas` — CampoAtualizavel só consome
  // chaves string|null (gerais).
  const dataGerais: ValoresGerais = {
    localizacaoCidade: form.data.localizacaoCidade,
    localizacaoUf: form.data.localizacaoUf,
    localizacaoPais: form.data.localizacaoPais,
    empregador: form.data.empregador,
    cargo: form.data.cargo,
    setor: form.data.setor,
    faixaSalarial: form.data.faixaSalarial,
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
            {total} {total === 1 ? 'campo' : 'campos'} no total. Diga &ldquo;Sim, ainda&rdquo; no
            que está certo, edite o que mudou. Pode pular o que quiser.
          </p>
        </div>

        {Object.keys(form.errors).length > 0 && (
          <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm">
            <ul className="list-disc space-y-1 pl-5">
              {Object.values(form.errors).map((erro, i) => (
                <li key={i}>{erro}</li>
              ))}
            </ul>
          </div>
        )}

        <section data-revisao-secao className="mt-6 space-y-3">
          <h2 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            Dados gerais
          </h2>
          <ul className="space-y-2.5">
            {CAMPOS_GERAIS.map((c) => {
              const key = keyGeral(c.id)
              return (
                <li key={key}>
                  <CampoAtualizavel
                    config={c}
                    data={dataGerais}
                    opcoes={opcoes}
                    status={status[key]}
                    editando={editando === key}
                    onConfirmar={() => confirmar(key)}
                    onEditar={() => setEditando(key)}
                    onSalvar={(patch) => salvarGeral(key, patch as Partial<ValoresGerais>)}
                    onCancelar={() => setEditando(null)}
                  />
                </li>
              )
            })}
          </ul>
        </section>

        {matriculas.map((m, i) => (
          <section key={m.id} data-revisao-secao className="mt-6 space-y-3">
            <h2 className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
              <GraduationCap className="size-3.5" /> {m.curto}
            </h2>
            {m.ehGraduacao ? (
              <ul className="space-y-2.5">
                {CAMPOS_MATRICULA.map((c) => {
                  const key = keyMatricula(m.id, c.id)
                  const mf = form.data.matriculas[i]
                  const dataMatricula: ValoresMatricula = {
                    relacaoFormacao: mf.relacaoFormacao,
                    tempoPrimeiroEmprego: mf.tempoPrimeiroEmprego,
                  }
                  return (
                    <li key={key}>
                      <CampoAtualizavel
                        config={c}
                        data={dataMatricula}
                        opcoes={opcoes}
                        status={status[key]}
                        editando={editando === key}
                        onConfirmar={() => confirmar(key)}
                        onEditar={() => setEditando(key)}
                        onSalvar={(patch) =>
                          salvarMatricula(key, i, patch as Partial<ValoresMatricula>)
                        }
                        onCancelar={() => setEditando(null)}
                      />
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Card className="p-4 text-muted-foreground text-sm italic">
                Campos da formação chegam em breve. Pós-graduação aparece com identidade só nesta
                entrega.
              </Card>
            )}
          </section>
        ))}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-muted-foreground text-xs">
          <Eye className="size-3.5" /> Esses dados aparecem só em análises agregadas, nunca
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

RespostasCreate.layout = (page: ReactElement) => <FlowLayout>{page}</FlowLayout>
