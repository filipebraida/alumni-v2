import { useMemo, useState } from 'react'
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

type NivelValor = 'graduacao' | 'especializacao' | 'mba' | 'mestrado' | 'doutorado' | 'posdoc'

const NIVEIS: { value: NivelValor; label: string }[] = [
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

export type ProgramaOption = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  institutoId: number
}

export type CursoEditavel = {
  id: number
  codigo: string
  nome: string
  nivel: NivelValor
  institutoId: number
  programaId: number | null
  ativo: boolean
}

type ModoCriar = { modo: 'criar' }
type ModoEditar = { modo: 'editar'; curso: CursoEditavel }

type Props = (ModoCriar | ModoEditar) & {
  institutos: InstitutoOption[]
  programas: ProgramaOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function exigePrograma(nivel: NivelValor) {
  return nivel !== 'graduacao'
}

export function CursoDialog(props: Props) {
  const criando = props.modo === 'criar'

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{criando ? 'Cadastrar curso' : `Editar ${props.curso.nome}`}</DialogTitle>
          <DialogDescription>
            {criando
              ? 'Curso da UFRRJ vinculado a um instituto. O código SIGAA é a chave natural — único no sistema.'
              : 'Atualize código, nome, nível, instituto, programa e status.'}
          </DialogDescription>
        </DialogHeader>

        {props.open && (
          <CursoForm
            key={criando ? 'novo' : props.curso.id}
            {...props}
            onSuccess={() => props.onOpenChange(false)}
          />
        )}
      </DialogPopup>
    </Dialog>
  )
}

function CursoForm(props: Props & { onSuccess: () => void }) {
  const criando = props.modo === 'criar'
  const [nivel, setNivel] = useState<NivelValor>(criando ? 'graduacao' : props.curso.nivel)
  const [institutoId, setInstitutoId] = useState<string>(
    criando ? (props.institutos[0]?.id?.toString() ?? '') : props.curso.institutoId.toString()
  )
  const [programaId, setProgramaId] = useState<string>(
    criando ? '' : (props.curso.programaId?.toString() ?? '')
  )
  const [ativo, setAtivo] = useState(criando ? true : props.curso.ativo)

  const programasDoInstituto = useMemo(
    () => props.programas.filter((p) => p.institutoId.toString() === institutoId),
    [props.programas, institutoId]
  )

  const mostraPrograma = exigePrograma(nivel)
  const semProgramaDisponivel = mostraPrograma && programasDoInstituto.length === 0

  function aoMudarInstituto(prox: string) {
    setInstitutoId(prox)
    // Limpa programa se não pertence ao novo instituto.
    if (
      programaId &&
      !props.programas.some(
        (p) => p.id.toString() === programaId && p.institutoId.toString() === prox
      )
    ) {
      setProgramaId('')
    }
  }

  function aoMudarNivel(prox: NivelValor) {
    setNivel(prox)
    if (!exigePrograma(prox)) setProgramaId('')
  }

  const formProps = criando
    ? ({ route: 'admin.cursos.store' } as const)
    : ({
        route: 'admin.cursos.update',
        routeParams: { id: props.curso.id },
      } as const)

  return (
    <Form {...formProps} resetOnSuccess={criando} onSuccess={props.onSuccess}>
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
                defaultValue={criando ? '' : props.curso.codigo}
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
                defaultValue={criando ? '' : props.curso.nome}
              />
              <FieldError />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field name="nivel">
                <FieldLabel>Nível</FieldLabel>
                <Select
                  name="nivel"
                  value={nivel}
                  onValueChange={(v) => aoMudarNivel((v ?? 'graduacao') as NivelValor)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) => NIVEIS.find((n) => n.value === value)?.label ?? ''}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {NIVEIS.map((n) => (
                      <SelectItem key={n.value} value={n.value}>
                        {n.label}
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
                  value={institutoId}
                  onValueChange={(v) => aoMudarInstituto(v ?? '')}
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
                        <span className="text-muted-foreground text-xs">· {instituto.codigo}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError />
              </Field>
            </div>

            {mostraPrograma && (
              <Field name="programaId">
                <FieldLabel>Programa de pós-graduação</FieldLabel>
                {semProgramaDisponivel ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum programa cadastrado para este instituto. Cadastre o programa antes de
                    criar um curso de pós-graduação.
                  </p>
                ) : (
                  <Select
                    name="programaId"
                    value={programaId}
                    onValueChange={(v) => setProgramaId(v ?? '')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value) =>
                          programasDoInstituto.find((p) => p.id.toString() === value)?.nome ??
                          'Selecione…'
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {programasDoInstituto.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nome}{' '}
                          <span className="text-muted-foreground text-xs">
                            · {p.sigla ?? p.codigo}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FieldError />
              </Field>
            )}

            {!criando && (
              <Field name="ativo">
                <div className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2">
                  <div>
                    <FieldLabel htmlFor="ativo" className="block text-sm">
                      Ativo
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs">
                      Cursos inativos não aparecem em novos cadastros e importações.
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
            <Button
              type="submit"
              disabled={processing || (mostraPrograma && (semProgramaDisponivel || !programaId))}
            >
              {processing ? 'Salvando…' : criando ? 'Cadastrar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Form>
  )
}

export function NovoCursoButton({
  institutos,
  programas,
}: {
  institutos: InstitutoOption[]
  programas: ProgramaOption[]
}) {
  const [aberto, setAberto] = useState(false)
  const semInstitutos = institutos.length === 0
  return (
    <>
      <Button disabled={semInstitutos} onClick={() => setAberto(true)}>
        <PlusIcon /> Novo curso
      </Button>
      <CursoDialog
        modo="criar"
        institutos={institutos}
        programas={programas}
        open={aberto}
        onOpenChange={setAberto}
      />
    </>
  )
}
