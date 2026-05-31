import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

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
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type ModalidadeValor = 'academico' | 'profissional'

const MODALIDADES: { value: ModalidadeValor; label: string }[] = [
  { value: 'academico', label: 'Acadêmico' },
  { value: 'profissional', label: 'Profissional' },
]

const SEM_MODALIDADE = '_nenhuma'

export type InstitutoOption = {
  id: number
  codigo: string
  nome: string
}

export function CriarProgramaDialog({ institutos }: { institutos: InstitutoOption[] }) {
  const [aberto, setAberto] = useState(false)
  const [modalidade, setModalidade] = useState<string>(SEM_MODALIDADE)
  const [institutoId, setInstitutoId] = useState<string>(
    institutos[0]?.id?.toString() ?? ''
  )
  const semInstitutos = institutos.length === 0

  function aoFecharOuAbrir(prox: boolean) {
    setAberto(prox)
    if (!prox) {
      setModalidade(SEM_MODALIDADE)
      setInstitutoId(institutos[0]?.id?.toString() ?? '')
    }
  }

  const enviarModalidade = modalidade !== SEM_MODALIDADE

  return (
    <Dialog open={aberto} onOpenChange={aoFecharOuAbrir}>
      <DialogTrigger
        render={
          <Button disabled={semInstitutos}>
            <PlusIcon /> Novo programa
          </Button>
        }
      />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Cadastrar programa</DialogTitle>
          <DialogDescription>
            Programa de Pós-Graduação (PPG) — aglutina mestrado e doutorado sob a mesma identidade
            institucional. O código (ex.: PPGIHD) é a chave natural.
          </DialogDescription>
        </DialogHeader>

        <Form route="admin.programas.store" resetOnSuccess onSuccess={() => aoFecharOuAbrir(false)}>
          {({ processing }) => (
            <>
              <DialogPanel className="flex flex-col gap-4">
                <Field name="codigo">
                  <FieldLabel htmlFor="codigo">Código</FieldLabel>
                  <Input
                    id="codigo"
                    name="codigo"
                    autoComplete="off"
                    placeholder="Ex.: PPGIHD"
                    maxLength={32}
                    autoFocus
                  />
                  <FieldError />
                </Field>

                <Field name="nome">
                  <FieldLabel htmlFor="nome">Nome</FieldLabel>
                  <Input
                    id="nome"
                    name="nome"
                    autoComplete="off"
                    placeholder="Ex.: Programa de Pós-Graduação Interdisciplinar em Humanidades Digitais"
                    maxLength={160}
                  />
                  <FieldError />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field name="sigla">
                    <FieldLabel htmlFor="sigla">Sigla (opcional)</FieldLabel>
                    <Input
                      id="sigla"
                      name="sigla"
                      autoComplete="off"
                      placeholder="Ex.: PPGIHD"
                      maxLength={32}
                    />
                    <FieldError />
                  </Field>

                  <Field name="modalidade">
                    <FieldLabel>Modalidade</FieldLabel>
                    <Select value={modalidade} onValueChange={(v) => setModalidade(v ?? SEM_MODALIDADE)}>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value) =>
                            !value || value === SEM_MODALIDADE
                              ? 'Não se aplica'
                              : MODALIDADES.find((m) => m.value === value)?.label ?? ''
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SEM_MODALIDADE}>Não se aplica</SelectItem>
                        {MODALIDADES.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {enviarModalidade && (
                      <input type="hidden" name="modalidade" value={modalidade} />
                    )}
                    <FieldError />
                  </Field>
                </div>

                <Field name="institutoId">
                  <FieldLabel>Instituto</FieldLabel>
                  <Select
                    name="institutoId"
                    value={institutoId}
                    onValueChange={(v) => setInstitutoId(v ?? '')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value) =>
                          institutos.find((i) => i.id.toString() === value)?.nome ?? ''
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {institutos.map((instituto) => (
                        <SelectItem key={instituto.id} value={instituto.id.toString()}>
                          {instituto.nome}{' '}
                          <span className="text-muted-foreground text-xs">
                            · {instituto.codigo}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError />
                </Field>
              </DialogPanel>

              <DialogFooter>
                <DialogClose render={<Button variant="ghost" type="button" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Salvando…' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
