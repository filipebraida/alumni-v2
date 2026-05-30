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

const NIVEIS: { value: string; label: string }[] = [
  { value: 'graduacao', label: 'Graduação' },
  { value: 'especializacao', label: 'Especialização' },
  { value: 'mba', label: 'MBA' },
  { value: 'mestrado', label: 'Mestrado' },
  { value: 'doutorado', label: 'Doutorado' },
  { value: 'posdoc', label: 'Pós-doutorado' },
]

export type InstitutoOption = {
  id: number
  codigo: string
  nome: string
}

export function CriarCursoDialog({ institutos }: { institutos: InstitutoOption[] }) {
  const [aberto, setAberto] = useState(false)
  const semInstitutos = institutos.length === 0

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          <Button disabled={semInstitutos}>
            <PlusIcon /> Novo curso
          </Button>
        }
      />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Cadastrar curso</DialogTitle>
          <DialogDescription>
            Curso da UFRRJ vinculado a um instituto. O código SIGAA é a chave natural — único no
            sistema.
          </DialogDescription>
        </DialogHeader>

        <Form route="admin.cursos.store" resetOnSuccess onSuccess={() => setAberto(false)}>
          {({ processing }) => (
            <>
              <DialogPanel className="flex flex-col gap-4">
                <Field name="codigo">
                  <FieldLabel htmlFor="codigo">Código SIGAA</FieldLabel>
                  <Input
                    id="codigo"
                    name="codigo"
                    autoComplete="off"
                    placeholder="Ex.: CCOMP-SRP"
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
                    placeholder="Ex.: Ciência da Computação"
                    maxLength={160}
                  />
                  <FieldError />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field name="nivel">
                    <FieldLabel>Nível</FieldLabel>
                    <Select name="nivel" defaultValue="graduacao">
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {(value) => NIVEIS.find((n) => n.value === value)?.label ?? ''}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {NIVEIS.map((nivel) => (
                          <SelectItem key={nivel.value} value={nivel.value}>
                            {nivel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>

                  <Field name="institutoId">
                    <FieldLabel>Instituto</FieldLabel>
                    <Select
                      name="institutoId"
                      defaultValue={institutos[0]?.id?.toString() ?? ''}
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
                </div>
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
