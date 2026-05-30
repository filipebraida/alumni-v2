import { useRef, useState } from 'react'
import { DownloadIcon, UploadIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Form } from '~/components/ui/form'

const MODELO_CSV = [
  'nomeCompleto,email,cpf,matriculaCodigo,situacao,periodoFormatura',
  'Maria Eduarda Lopes,maria.lopes@ufrrj.br,12345678901,2018212031,formado,2024.1',
  'João Pedro Almeida,joao.almeida@ufrrj.br,23456789012,2022100456,cursando,',
  'Carla Beatriz Souza,carla.souza@ufrrj.br,34567890123,2019200789,evadido,',
].join('\n')

/**
 * Modal "Importar planilha": envia o CSV para `gestao.egressos.importacoes.store`
 * em multipart. O Inertia Form detecta o input file e faz o switch para FormData
 * automaticamente. O relatório do que entrou/falhou volta via flash e é
 * renderizado em outro dialog na página.
 */
export function ImportarEgressosDialog({ cursoNome }: { cursoNome: string }) {
  const [aberto, setAberto] = useState(false)
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  function baixarModelo() {
    const blob = new Blob([MODELO_CSV], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'modelo-importacao-egressos.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger render={<Button variant="outline" />}>
        <UploadIcon /> Importar planilha
      </DialogTrigger>

      <DialogPopup className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar planilha</DialogTitle>
          <DialogDescription>{cursoNome} · cadastro em lote por CSV</DialogDescription>
        </DialogHeader>

        <Form
          route="gestao.egressos.importacoes.store"
          resetOnSuccess
          onSuccess={() => {
            setAberto(false)
            if (inputFileRef.current) inputFileRef.current.value = ''
          }}
        >
          {({ processing }) => (
            <>
              <DialogPanel className="flex flex-col gap-4">
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Colunas esperadas (nessa ordem)</p>
                  <p className="mt-1 text-muted-foreground">
                    nomeCompleto, email, cpf, matriculaCodigo, situacao, periodoFormatura
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={baixarModelo}
                  >
                    <DownloadIcon /> Baixar modelo CSV
                  </Button>
                </div>

                <Field name="arquivo">
                  <FieldLabel htmlFor="arquivo">Arquivo CSV</FieldLabel>
                  <input
                    ref={inputFileRef}
                    id="arquivo"
                    name="arquivo"
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    required
                    className="block w-full cursor-pointer rounded-md border border-input bg-background text-sm file:mr-3 file:cursor-pointer file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-muted/80"
                  />
                  <FieldError />
                </Field>

                <p className="text-muted-foreground text-xs">
                  CPF já cadastrado mantém a identidade (nome/CPF/e-mail) intacta. Linhas para
                  pessoas já neste curso atualizam apenas situação e turma.
                </p>
              </DialogPanel>

              <DialogFooter>
                <DialogClose render={<Button variant="ghost" type="button" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={processing}>
                  <UploadIcon /> {processing ? 'Importando…' : 'Importar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
