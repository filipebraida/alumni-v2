import { Head, useForm } from '@inertiajs/react'
import { type ReactElement, type FormEvent } from 'react'
import { urlFor } from '~/client'
import FlowLayout from '~/layouts/flow'
import { Button } from '~/components/ui/button'
import { type InertiaProps } from '~/types'

type EnumOption = { valor: string; rotulo: string }

type Opcoes = {
  setor: EnumOption[]
  faixaSalarial: EnumOption[]
  relacaoFormacao: EnumOption[]
  tempoPrimeiroEmprego: EnumOption[]
}

type MatriculaItem = {
  id: number
  nivel: string
  curto: string
  ehGraduacao: boolean
  valoresAtuais: {
    faixaSalarial: string | null
    relacaoFormacao: string | null
    tempoPrimeiroEmprego: string | null
  } | null
}

type ValoresGerais = {
  localizacaoCidade: string | null
  localizacaoUf: string | null
  localizacaoPais: string | null
  empregador: string | null
  cargo: string | null
  setor: string | null
}

type FormShape = ValoresGerais & {
  matriculas: Array<{
    id: number
    relacaoFormacao: string | null
    faixaSalarial: string | null
    tempoPrimeiroEmprego: string | null
  }>
}

type PageProps = InertiaProps<{
  valores: ValoresGerais
  matriculas: MatriculaItem[]
  opcoes: Opcoes
}>

export default function RespostasCreate({ valores, matriculas, opcoes }: PageProps) {
  const form = useForm<FormShape>({
    ...valores,
    matriculas: matriculas.map((m) => ({
      id: m.id,
      faixaSalarial: m.valoresAtuais?.faixaSalarial ?? null,
      relacaoFormacao: m.valoresAtuais?.relacaoFormacao ?? null,
      tempoPrimeiroEmprego: m.valoresAtuais?.tempoPrimeiroEmprego ?? null,
    })),
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    form.post(urlFor('respostas.store'))
  }

  return (
    <>
      <Head title="Atualizar dados · SAE UFRRJ" />

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8 px-6 py-8">
        <section data-revisao-secao className="space-y-4">
          <h2 className="font-semibold text-lg">Dados gerais</h2>

          <Campo label="Cidade">
            <input
              type="text"
              value={form.data.localizacaoCidade ?? ''}
              onChange={(e) => form.setData('localizacaoCidade', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
            />
          </Campo>

          <Campo label="UF" erro={form.errors.localizacaoUf}>
            <input
              type="text"
              value={form.data.localizacaoUf ?? ''}
              onChange={(e) => form.setData('localizacaoUf', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
              maxLength={3}
            />
          </Campo>

          <Campo label="País">
            <input
              type="text"
              value={form.data.localizacaoPais ?? ''}
              onChange={(e) => form.setData('localizacaoPais', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
            />
          </Campo>

          <Campo label="Empresa atual">
            <input
              type="text"
              value={form.data.empregador ?? ''}
              onChange={(e) => form.setData('empregador', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
            />
          </Campo>

          <Campo label="Cargo / função">
            <input
              type="text"
              value={form.data.cargo ?? ''}
              onChange={(e) => form.setData('cargo', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
            />
          </Campo>

          <Campo label="Setor">
            <select
              value={form.data.setor ?? ''}
              onChange={(e) => form.setData('setor', e.target.value || null)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">— escolha —</option>
              {opcoes.setor.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </Campo>
        </section>

        {matriculas.map((m, i) => (
          <section key={m.id} data-revisao-secao className="space-y-4">
            <h2 className="font-semibold text-lg">{m.curto}</h2>

            {m.ehGraduacao ? (
              <>
                <Campo label="Faixa salarial">
                  <select
                    value={form.data.matriculas[i]?.faixaSalarial ?? ''}
                    onChange={(e) =>
                      atualizarMatricula(form, i, 'faixaSalarial', e.target.value || null)
                    }
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">— escolha —</option>
                    {opcoes.faixaSalarial.map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.rotulo}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Atua na área formada?">
                  <select
                    value={form.data.matriculas[i]?.relacaoFormacao ?? ''}
                    onChange={(e) =>
                      atualizarMatricula(form, i, 'relacaoFormacao', e.target.value || null)
                    }
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">— escolha —</option>
                    {opcoes.relacaoFormacao.map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.rotulo}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Tempo até o 1º emprego">
                  <select
                    value={form.data.matriculas[i]?.tempoPrimeiroEmprego ?? ''}
                    onChange={(e) =>
                      atualizarMatricula(form, i, 'tempoPrimeiroEmprego', e.target.value || null)
                    }
                    className="w-full rounded-md border px-3 py-2"
                  >
                    <option value="">— escolha —</option>
                    {opcoes.tempoPrimeiroEmprego.map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.rotulo}
                      </option>
                    ))}
                  </select>
                </Campo>
              </>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Campos da formação chegam em breve.
              </p>
            )}
          </section>
        ))}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.processing}>
            Concluir
          </Button>
        </div>
      </form>
    </>
  )
}

function Campo({
  label,
  children,
  erro,
}: {
  label: string
  children: React.ReactNode
  erro?: string
}) {
  return (
    <label className="block">
      <span className="block font-medium text-sm">{label}</span>
      <div className="mt-1">{children}</div>
      {erro && <span className="mt-1 block text-destructive text-xs">{erro}</span>}
    </label>
  )
}

function atualizarMatricula(
  form: ReturnType<typeof useForm<FormShape>>,
  index: number,
  campo: 'faixaSalarial' | 'relacaoFormacao' | 'tempoPrimeiroEmprego',
  valor: string | null
) {
  const matriculas = [...form.data.matriculas]
  matriculas[index] = { ...matriculas[index], [campo]: valor }
  form.setData('matriculas', matriculas)
}

RespostasCreate.layout = (page: ReactElement) => <FlowLayout>{page}</FlowLayout>
