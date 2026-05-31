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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'

export type InstitutoOption = {
  id: number
  codigo: string
  nome: string
}

type ModalidadeValor = 'academico' | 'profissional'

const MODALIDADES: { value: ModalidadeValor; label: string }[] = [
  { value: 'academico', label: 'Acadêmico' },
  { value: 'profissional', label: 'Profissional' },
]

const SEM_MODALIDADE = '_nenhuma'

export type ProgramaEditavel = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: ModalidadeValor | null
  institutoId: number
  ativo: boolean
}

type ModoCriar = { modo: 'criar' }
type ModoEditar = { modo: 'editar'; programa: ProgramaEditavel }

type Props = (ModoCriar | ModoEditar) & {
  institutos: InstitutoOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProgramaDialog(props: Props) {
  const criando = props.modo === 'criar'

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            {criando ? 'Cadastrar programa' : `Editar ${props.programa.nome}`}
          </DialogTitle>
          <DialogDescription>
            {criando
              ? 'Programa de Pós-Graduação (PPG) — aglutina mestrado e doutorado sob a mesma identidade institucional. O código (ex.: PPGIHD) é a chave natural.'
              : 'Atualize código, nome, sigla, modalidade, instituto e status.'}
          </DialogDescription>
        </DialogHeader>

        {props.open && (
          <ProgramaForm
            key={criando ? 'novo' : props.programa.id}
            {...props}
            onSuccess={() => props.onOpenChange(false)}
          />
        )}
      </DialogPopup>
    </Dialog>
  )
}

function ProgramaForm(props: Props & { onSuccess: () => void }) {
  const criando = props.modo === 'criar'
  const [modalidade, setModalidade] = useState<string>(
    criando ? SEM_MODALIDADE : props.programa.modalidade ?? SEM_MODALIDADE
  )
  const [institutoId, setInstitutoId] = useState<string>(
    criando
      ? props.institutos[0]?.id?.toString() ?? ''
      : props.programa.institutoId.toString()
  )
  const [ativo, setAtivo] = useState(criando ? true : props.programa.ativo)

  const enviarModalidade = modalidade !== SEM_MODALIDADE

  const formProps = criando
    ? ({ route: 'admin.programas.store' } as const)
    : ({
        route: 'admin.programas.update',
        routeParams: { id: props.programa.id },
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
                placeholder="Ex.: PPGIHD"
                maxLength={32}
                defaultValue={criando ? '' : props.programa.codigo}
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
                defaultValue={criando ? '' : props.programa.nome}
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
                  defaultValue={criando ? '' : props.programa.sigla ?? ''}
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
                      props.institutos.find((i) => i.id.toString() === value)?.nome ?? ''
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {props.institutos.map((instituto) => (
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

            {!criando && (
              <Field name="ativo">
                <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
                  <div>
                    <FieldLabel htmlFor="ativo" className="block text-sm">
                      Ativo
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs">
                      Programas inativos não recebem novos cursos.
                    </p>
                  </div>
                  <Switch
                    id="ativo"
                    checked={ativo}
                    onCheckedChange={(checked) => setAtivo(checked)}
                  />
                </div>
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

export function NovoProgramaButton({ institutos }: { institutos: InstitutoOption[] }) {
  const [aberto, setAberto] = useState(false)
  const semInstitutos = institutos.length === 0
  return (
    <>
      <Button disabled={semInstitutos} onClick={() => setAberto(true)}>
        <PlusIcon /> Novo programa
      </Button>
      <ProgramaDialog
        modo="criar"
        institutos={institutos}
        open={aberto}
        onOpenChange={setAberto}
      />
    </>
  )
}
