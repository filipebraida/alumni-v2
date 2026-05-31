import { useState } from 'react'
import { AlertTriangleIcon, PencilIcon, PlusIcon, SearchIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from '~/components/ui/combobox'
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
  /** Se o user já tem perfil de egresso, pode ficar sem admin e sem cursos. */
  temEgresso: boolean
}

type Props = (ModoCriar | ModoEditar) & { cursos: CursoOption[] }

export function UsuarioDialog(props: Props) {
  const [aberto, setAberto] = useState(false)
  const criando = props.modo === 'criar'

  const tituloDialog = criando
    ? 'Cadastrar usuário'
    : `Editar ${props.usuario.fullName ?? props.usuario.email}`
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
            // Re-monta o form ao trocar de usuário no modo edit — garante que
            // o combobox e o switch comecem com o estado inicial certo.
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
  const adminInicial = criando ? false : props.usuario.role === 'admin'
  const selecionadosIniciais = criando
    ? []
    : props.cursos.filter((c) => props.usuario.cursosIds.includes(c.id))
  const [selecionados, setSelecionados] = useState<CursoOption[]>(selecionadosIniciais)
  const [isAdmin, setIsAdmin] = useState(adminInicial)

  const temEgresso = criando ? false : props.temEgresso
  const ficariaOrfao = !isAdmin && selecionados.length === 0 && !temEgresso

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
                defaultValue={criando ? '' : (props.usuario.fullName ?? '')}
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
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked)}
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
                <Combobox<CursoOption, true>
                  multiple
                  items={props.cursos}
                  value={selecionados}
                  onValueChange={(v) => setSelecionados(v)}
                  itemToStringLabel={(c) => `${c.codigo} · ${c.nome}`}
                  itemToStringValue={(c) => String(c.id)}
                  isItemEqualToValue={(a, b) => a.id === b.id}
                >
                  <ComboboxChips startAddon={<SearchIcon />}>
                    {selecionados.map((curso) => (
                      <ComboboxChip key={curso.id}>{curso.codigo}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      placeholder={
                        selecionados.length > 0 ? 'Adicionar outro curso…' : 'Buscar curso…'
                      }
                    />
                  </ComboboxChips>
                  <ComboboxPopup>
                    <ComboboxList>
                      {(curso: CursoOption) => (
                        <ComboboxItem key={curso.id} value={curso}>
                          <div className="min-w-0">
                            <div className="truncate text-sm">{curso.nome}</div>
                            <div className="truncate text-muted-foreground text-xs">
                              {curso.codigo}
                            </div>
                          </div>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                    <ComboboxEmpty>Nenhum curso bate com a busca.</ComboboxEmpty>
                  </ComboboxPopup>
                </Combobox>
              )}
              {/* O Combobox vive como state controlado; o submit pega os IDs
                  destes inputs hidden — o padrão `cursosIds[]` vira array no
                  body parser do Adonis. */}
              {selecionados.map((curso) => (
                <input key={curso.id} type="hidden" name="cursosIds[]" value={curso.id} />
              ))}
              <FieldError />
            </Field>

            {ficariaOrfao && (
              <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/8 p-3 text-sm">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-warning" />
                <p>
                  Sem curso e sem administrador, este usuário não consegue entrar em nenhuma área do
                  SAE. Marque como administrador ou vincule pelo menos um curso.
                </p>
              </div>
            )}
          </DialogPanel>

          <DialogFooter>
            <DialogClose render={<Button variant="ghost" type="button" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={processing || ficariaOrfao}>
              {processing ? 'Salvando…' : criando ? 'Cadastrar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Form>
  )
}
