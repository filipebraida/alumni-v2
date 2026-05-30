import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { type ReactElement } from 'react'
import { AlertTriangleIcon, ArrowLeftIcon, CheckCircle2Icon } from 'lucide-react'

import GestaoLayout from '~/layouts/gestao'
import { Button } from '~/components/ui/button'
import { type InertiaProps } from '~/types'

type LinhaComErro = { linha: number; motivo: string; nome?: string; cpf?: string }

type Relatorio = {
  total: number
  criados: number
  vinculados: number
  jaNoCurso: number
  erros: LinhaComErro[]
}

type PageProps = InertiaProps<{
  relatorio: Relatorio
  cursoNome: string
  nomeArquivo: string | null
}>

export default function ImportacaoResultado({ relatorio, cursoNome, nomeArquivo }: PageProps) {
  const aplicados = relatorio.criados + relatorio.vinculados
  const teveErro = relatorio.erros.length > 0

  return (
    <>
      <Head title="Gestão · Resultado da importação" />

      <div className="p-4 sm:p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <h1 className="font-semibold text-2xl leading-tight tracking-tight">
              Resultado da importação
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {cursoNome}
              {nomeArquivo && <> · {nomeArquivo}</>} — {relatorio.total} linha
              {relatorio.total === 1 ? '' : 's'} processada{relatorio.total === 1 ? '' : 's'} ·{' '}
              {aplicados} aplicada{aplicados === 1 ? '' : 's'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SumarioCard label="Criados" valor={relatorio.criados} />
            <SumarioCard label="Vinculados" valor={relatorio.vinculados} />
            <SumarioCard label="Já no curso" valor={relatorio.jaNoCurso} />
            <SumarioCard label="Com erro" valor={relatorio.erros.length} destaque={teveErro} />
          </div>

          {!teveErro && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
              <CheckCircle2Icon className="mt-0.5 size-4 text-emerald-600" />
              <p>Todas as linhas foram processadas sem erros.</p>
            </div>
          )}

          {teveErro && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangleIcon className="size-4 text-amber-600" />
                Linhas com erro
              </div>
              <div className="overflow-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Linha</th>
                      <th className="px-3 py-2 font-medium">Identificação</th>
                      <th className="px-3 py-2 font-medium">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorio.erros.map((erro, idx) => (
                      <tr key={`${erro.linha}-${idx}`} className="border-t border-border">
                        <td className="px-3 py-2 align-top tabular-nums">{erro.linha}</td>
                        <td className="px-3 py-2 align-top text-muted-foreground">
                          {erro.nome ?? '—'}
                          {erro.cpf && (
                            <span className="block text-xs tabular-nums">{erro.cpf}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top">{erro.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link route="gestao.egressos">
              <Button>
                <ArrowLeftIcon /> Voltar para egressos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function SumarioCard({
  label,
  valor,
  destaque,
}: {
  label: string
  valor: number
  destaque?: boolean
}) {
  return (
    <div
      className={
        destaque
          ? 'rounded-md border border-amber-200 bg-amber-50 p-3'
          : 'rounded-md border border-border bg-muted/40 p-3'
      }
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{valor}</p>
    </div>
  )
}

ImportacaoResultado.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
