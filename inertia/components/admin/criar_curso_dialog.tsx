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

type NivelValor =
  | 'graduacao'
  | 'especializacao'
  | 'mba'
  | 'mestrado'
  | 'doutorado'
  | 'posdoc'

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

function exigePrograma(nivel: NivelValor) {
  return nivel !== 'graduacao'
}

export function CriarCursoDialog({
  institutos,
  programas,
}: {
  institutos: InstitutoOption[]
  programas: ProgramaOption[]
}) {
  const [aberto, setAberto] = useState(false)
  const [nivel, setNivel] = useState<NivelValor>('graduacao')
  const [institutoId, setInstitutoId] = useState<string>(
    institutos[0]?.id?.toString() ?? ''
  )
  const [programaId, setProgramaId] = useState<string>('')
  const semInstitutos = institutos.length === 0

  const programasDoInstituto = useMemo(
    () => programas.filter((p) => p.institutoId.toString() === institutoId),
    [programas, institutoId]
  )

  const mostraPrograma = exigePrograma(nivel)
  const semProgramaDisponivel = mostraPrograma && programasDoInstituto.length === 0

  function aoFecharOuAbrir(prox: boolean) {
    setAberto(prox)
    if (!prox) {
      setNivel('graduacao')
      setInstitutoId(institutos[0]?.id?.toString() ?? '')
      setProgramaId('')
    }
  }

  function aoMudarInstituto(prox: string) {
    setInstitutoId(prox)
    // Programa selecionado pode não pertencer ao novo instituto — limpa.
    setProgramaId('')
  }

  function aoMudarNivel(prox: NivelValor) {
    setNivel(prox)
    if (!exigePrograma(prox)) setProgramaId('')
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFecharOuAbrir}>
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

        <Form route="admin.cursos.store" resetOnSuccess onSuccess={() => aoFecharOuAbrir(false)}>
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

                {mostraPrograma && (
                  <Field name="programaId">
                    <FieldLabel>Programa de pós-graduação</FieldLabel>
                    {semProgramaDisponivel ? (
                      <p className="text-muted-foreground text-sm">
                        Nenhum programa cadastrado para este instituto. Cadastre o programa antes
                        de criar um curso de pós-graduação.
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
              </DialogPanel>

              <DialogFooter>
                <DialogClose render={<Button variant="ghost" type="button" />}>
                  Cancelar
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    processing || (mostraPrograma && (semProgramaDisponivel || !programaId))
                  }
                >
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
