import { useState } from 'react'
import { PlusIcon, PencilIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
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
import { Switch } from '~/components/ui/switch'

export type CursoOption = { id: number; codigo: string; nome: string }

type ModoCriar = { modo: 'criar' }
type ModoEditar = {
  modo: 'editar'
  usuario: {
    id: number
    fullName: string | null
    email: string
    role: 'usuario' | 'admin'
    cursosIds: number[]
  }
  bloqueiaTirarAdmin: boolean
}

type Props = (ModoCriar | ModoEditar) & { cursos: CursoOption[] }

export function UsuarioDialog(props: Props) {
  const [aberto, setAberto] = useState(false)
  const criando = props.modo === 'criar'

  const tituloDialog = criando ? 'Cadastrar usuário' : `Editar ${props.usuario.fullName ?? props.usuario.email}`
  const descricao = criando
    ? 'Pessoa que acessa o SAE. Marque como administrador e/ou vincule a um ou mais cursos como coordenador(a).'
    : 'Atualize o nome, a permissão de administrador e os cursos coordenados.'

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          criando ? (
            <Button>
              <PlusIcon /> Novo usuário
            </Button>
          ) : (
            <Button variant="ghost" size="sm">
              <PencilIcon /> Editar
            </Button>
          )
        }
      />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{tituloDialog}</DialogTitle>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>

        {aberto && (
          <UsuarioForm
            // Re-monta o form ao trocar de usuário no modo edit — garante que os
            // checkboxes de cursos comecem com o `defaultChecked` correto.
            key={criando ? 'novo' : props.usuario.id}
            {...props}
            onSuccess={() => setAberto(false)}
          />
        )}
      </DialogPopup>
    </Dialog>
  )
}

function UsuarioForm(props: Props & { onSuccess: () => void }) {
  const criando = props.modo === 'criar'
  const cursosSelecionadosInicial = criando ? new Set<number>() : new Set(props.usuario.cursosIds)
  const adminInicial = criando ? false : props.usuario.role === 'admin'

  const formProps = criando
    ? ({ route: 'admin.usuarios.store' } as const)
    : ({ route: 'admin.usuarios.update', routeParams: { id: props.usuario.id } } as const)

  return (
    <Form {...formProps} resetOnSuccess={criando} onSuccess={props.onSuccess}>
      {({ processing }) => (
        <>
          <DialogPanel className="flex flex-col gap-4">
            <Field name="fullName">
              <FieldLabel htmlFor="fullName">Nome completo</FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="off"
                placeholder="Ex.: Juliana Nascente"
                maxLength={255}
                defaultValue={criando ? '' : props.usuario.fullName ?? ''}
                autoFocus
              />
              <FieldError />
            </Field>

            <Field name="email">
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                name={criando ? 'email' : undefined}
                type="email"
                autoComplete="off"
                placeholder="nome.sobrenome@ufrrj.br"
                maxLength={254}
                defaultValue={criando ? '' : props.usuario.email}
                readOnly={!criando}
                disabled={!criando}
              />
              <FieldError />
            </Field>

            <Field name="isAdmin">
              <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
                <div>
                  <FieldLabel htmlFor="isAdmin" className="block text-sm">
                    Administrador
                  </FieldLabel>
                  <p className="text-muted-foreground text-xs">
                    Acessa toda a administração e qualquer curso na gestão.
                  </p>
                </div>
                <Switch
                  id="isAdmin"
                  name="isAdmin"
                  value="true"
                  defaultChecked={adminInicial}
                  disabled={!criando && props.bloqueiaTirarAdmin}
                />
              </div>
              <FieldError />
            </Field>

            <Field name="cursosIds">
              <FieldLabel>Cursos coordenados</FieldLabel>
              {props.cursos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Cadastre um curso antes de vincular coordenadores.
                </p>
              ) : (
                <ul className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-md border p-2 sm:grid-cols-2">
                  {props.cursos.map((curso) => (
                    <li key={curso.id}>
                      <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                        <Checkbox
                          name="cursosIds[]"
                          value={String(curso.id)}
                          defaultChecked={cursosSelecionadosInicial.has(curso.id)}
                          className="mt-0.5"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm">{curso.nome}</span>
                          <span className="block truncate text-muted-foreground text-xs">
                            {curso.codigo}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <FieldError />
            </Field>
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
