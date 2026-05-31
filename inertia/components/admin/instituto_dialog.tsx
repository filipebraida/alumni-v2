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
} from '~/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'

export type InstitutoEditavel = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
}

type ModoCriar = { modo: 'criar' }
type ModoEditar = { modo: 'editar'; instituto: InstitutoEditavel }

type Props = (ModoCriar | ModoEditar) & {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog controlado para criar ou editar instituto. O trigger fica fora
 * (botão de header ou item de Menu) — só passe `open` + `onOpenChange`.
 */
export function InstitutoDialog(props: Props) {
  const criando = props.modo === 'criar'

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            {criando ? 'Cadastrar instituto' : `Editar ${props.instituto.nome}`}
          </DialogTitle>
          <DialogDescription>
            {criando
              ? 'Institutos agrupam os cursos da UFRRJ por unidade. Use o código curto (ex.: SRP, NI) como chave natural — fica visível em listagens.'
              : 'Atualize o código, o nome e o status do instituto.'}
          </DialogDescription>
        </DialogHeader>

        {props.open && (
          <InstitutoForm
            // Re-monta o form ao trocar o instituto sendo editado.
            key={criando ? 'novo' : props.instituto.id}
            {...props}
            onSuccess={() => props.onOpenChange(false)}
          />
        )}
      </DialogPopup>
    </Dialog>
  )
}

function InstitutoForm(props: Props & { onSuccess: () => void }) {
  const criando = props.modo === 'criar'
  const [ativo, setAtivo] = useState(criando ? true : props.instituto.ativo)

  const formProps = criando
    ? ({ route: 'admin.institutos.store' } as const)
    : ({
        route: 'admin.institutos.update',
        routeParams: { id: props.instituto.id },
      } as const)

  return (
    <Form {...formProps} resetOnSuccess={criando} onSuccess={props.onSuccess}>
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
                defaultValue={criando ? '' : props.instituto.codigo}
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
                defaultValue={criando ? '' : props.instituto.nome}
              />
              <FieldError />
            </Field>

            {!criando && (
              <Field name="ativo">
                <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
                  <div>
                    <FieldLabel htmlFor="ativo" className="block text-sm">
                      Ativo
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs">
                      Institutos inativos não recebem novos cursos.
                    </p>
                  </div>
                  <Switch
                    id="ativo"
                    checked={ativo}
                    onCheckedChange={(checked) => setAtivo(checked)}
                  />
                </div>
                {/* Hidden mantém o booleano cheio (Switch unchecked não envia nome). */}
                <input type="hidden" name="ativo" value={ativo ? 'true' : 'false'} />
                <FieldError />
              </Field>
            )}
          </DialogPanel>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" type="button" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={processing}>
              {processing ? 'Salvando…' : criando ? 'Cadastrar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Form>
  )
}

/** Botão "Novo instituto" do header. Encapsula o trigger + estado. */
export function NovoInstitutoButton() {
  const [aberto, setAberto] = useState(false)
  return (
    <>
      <Button onClick={() => setAberto(true)}>
        <PlusIcon /> Novo instituto
      </Button>
      <InstitutoDialog modo="criar" open={aberto} onOpenChange={setAberto} />
    </>
  )
}
