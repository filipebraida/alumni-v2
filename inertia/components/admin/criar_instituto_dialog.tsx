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

export function CriarInstitutoDialog() {
  const [aberto, setAberto] = useState(false)

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon /> Novo instituto
          </Button>
        }
      />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Cadastrar instituto</DialogTitle>
          <DialogDescription>
            Institutos agrupam os cursos da UFRRJ por unidade. Use o código curto (ex.: SRP, NI)
            como chave natural — fica visível em listagens.
          </DialogDescription>
        </DialogHeader>

        <Form route="admin.institutos.store" resetOnSuccess onSuccess={() => setAberto(false)}>
          {({ processing }) => (
            <>
              <DialogPanel className="flex flex-col gap-4">
                <Field name="codigo">
                  <FieldLabel htmlFor="codigo">Código</FieldLabel>
                  <Input
                    id="codigo"
                    name="codigo"
                    autoComplete="off"
                    placeholder="Ex.: SRP"
                    maxLength={16}
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
                    placeholder="Ex.: Seropédica"
                    maxLength={120}
                  />
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
