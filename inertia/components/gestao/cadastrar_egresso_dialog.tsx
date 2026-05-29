import { useState } from 'react'
import { UserPlusIcon } from 'lucide-react'

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

const SITUACOES: { value: string; label: string }[] = [
  { value: 'formado', label: 'Formado' },
  { value: 'cursando', label: 'Cursando' },
  { value: 'evadido', label: 'Evadido' },
]

/**
 * Modal "Cadastrar egresso": adiciona uma pessoa direto ao roster do curso ativo
 * (sem campanha/convite). Envia via Inertia para `gestao.egressos.store`; fecha e
 * reseta no sucesso. Erros de validação aparecem por campo (FieldError).
 */
export function CadastrarEgressoDialog({ cursoNome }: { cursoNome: string }) {
  const [aberto, setAberto] = useState(false)

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon /> Cadastrar egresso
      </DialogTrigger>

      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar egresso</DialogTitle>
          <DialogDescription>{cursoNome} · adicionar ao roster do curso</DialogDescription>
        </DialogHeader>

        <Form route="gestao.egressos.store" resetOnSuccess onSuccess={() => setAberto(false)}>
          {({ processing }) => (
            <>
              <DialogPanel className="flex flex-col gap-4">
                <Field name="nomeCompleto">
                  <FieldLabel htmlFor="nomeCompleto">Nome completo</FieldLabel>
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    autoComplete="off"
                    placeholder="Ex.: Maria Eduarda Lopes"
                  />
                  <FieldError />
                </Field>

                <Field name="email">
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    placeholder="nome.sobrenome@ufrrj.br"
                  />
                  <FieldError />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field name="cpf">
                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                    <Input id="cpf" name="cpf" autoComplete="off" placeholder="000.000.000-00" />
                    <FieldError />
                  </Field>

                  <Field name="matriculaCodigo">
                    <FieldLabel htmlFor="matriculaCodigo">Matrícula</FieldLabel>
                    <Input
                      id="matriculaCodigo"
                      name="matriculaCodigo"
                      autoComplete="off"
                      placeholder="2018212031"
                    />
                    <FieldError />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field name="situacao">
                    <FieldLabel>Situação</FieldLabel>
                    <Select name="situacao" defaultValue="formado">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SITUACOES.map((situacao) => (
                          <SelectItem key={situacao.value} value={situacao.value}>
                            {situacao.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>

                  <Field name="periodoFormatura">
                    <FieldLabel htmlFor="periodoFormatura">Turma</FieldLabel>
                    <Input
                      id="periodoFormatura"
                      name="periodoFormatura"
                      autoComplete="off"
                      placeholder="2024.1"
                    />
                    <FieldError />
                  </Field>
                </div>
              </DialogPanel>

              <DialogFooter>
                <DialogClose render={<Button variant="ghost" type="button" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={processing}>
                  <UserPlusIcon /> {processing ? 'Cadastrando…' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
