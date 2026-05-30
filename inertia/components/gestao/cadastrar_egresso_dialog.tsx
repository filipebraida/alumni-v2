import { useState, type FormEvent } from 'react'
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
  SearchIcon,
  UserPlusIcon,
} from 'lucide-react'

import { urlFor } from '~/client'
import { apenasDigitosCpf, formatarCpf } from '~/lib/cpf'
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

type LookupResult =
  | { status: 'nao_encontrado' }
  | { status: 'fora_do_curso'; egresso: { id: number; nome: string }; outrosCursos: number }
  | {
      status: 'ja_no_curso'
      egresso: { id: number; nome: string }
      matricula: { codigo: string; situacao: string; periodoFormatura: string | null }
    }

type Etapa = 'busca' | 'criar' | 'vincular' | 'ja_no_curso'

/**
 * Modal "Cadastrar egresso". Etapa 1 busca por CPF para descobrir se a pessoa
 * já existe. Conforme o resultado, segue para um dos três fluxos: criar (form
 * completo), vincular (egresso existente, só matrícula+situação+turma) ou
 * apenas informa que a pessoa já está neste curso.
 */
export function CadastrarEgressoDialog({ cursoNome }: { cursoNome: string }) {
  const [aberto, setAberto] = useState(false)
  const [etapa, setEtapa] = useState<Etapa>('busca')
  const [cpf, setCpf] = useState('')
  const [lookup, setLookup] = useState<LookupResult | null>(null)

  function reset() {
    setEtapa('busca')
    setCpf('')
    setLookup(null)
  }

  function fechar() {
    setAberto(false)
  }

  function aoFecharCompletar(open: boolean) {
    if (!open) reset()
  }

  function aplicarLookup(resultado: LookupResult) {
    setLookup(resultado)
    if (resultado.status === 'nao_encontrado') setEtapa('criar')
    else if (resultado.status === 'fora_do_curso') setEtapa('vincular')
    else setEtapa('ja_no_curso')
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto} onOpenChangeComplete={aoFecharCompletar}>
      <DialogTrigger render={<Button />}>
        <UserPlusIcon /> Cadastrar egresso
      </DialogTrigger>

      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar egresso</DialogTitle>
          <DialogDescription>
            {cursoNome} · {descricaoEtapa(etapa)}
          </DialogDescription>
        </DialogHeader>

        {etapa === 'busca' && (
          <BuscaPorCpf cpf={cpf} setCpf={setCpf} onEncontrado={aplicarLookup} />
        )}

        {etapa === 'criar' && (
          <CadastrarNovo cpfInicial={cpf} onSuccess={fechar} onVoltar={reset} />
        )}

        {etapa === 'vincular' && lookup?.status === 'fora_do_curso' && (
          <VincularExistente
            egresso={lookup.egresso}
            outrosCursos={lookup.outrosCursos}
            onSuccess={fechar}
            onVoltar={reset}
          />
        )}

        {etapa === 'ja_no_curso' && lookup?.status === 'ja_no_curso' && (
          <JaNoCurso egresso={lookup.egresso} matricula={lookup.matricula} onFechar={fechar} />
        )}
      </DialogPopup>
    </Dialog>
  )
}

function descricaoEtapa(etapa: Etapa) {
  switch (etapa) {
    case 'busca':
      return 'buscar pessoa por CPF'
    case 'criar':
      return 'cadastrar nova pessoa'
    case 'vincular':
      return 'vincular egresso existente'
    case 'ja_no_curso':
      return 'pessoa já cadastrada neste curso'
  }
}

function BuscaPorCpf({
  cpf,
  setCpf,
  onEncontrado,
}: {
  cpf: string
  setCpf: (v: string) => void
  onEncontrado: (r: LookupResult) => void
}) {
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const cpfDigitos = apenasDigitosCpf(cpf)
  const pronto = cpfDigitos.length === 11

  async function buscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!pronto || buscando) return
    setBuscando(true)
    setErro(null)
    try {
      const url = `${urlFor('gestao.egressos.lookup')}?cpf=${encodeURIComponent(cpfDigitos)}`
      const resposta = await fetch(url, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
      if (!resposta.ok) {
        setErro('Não foi possível consultar agora. Tente novamente em instantes.')
        return
      }
      const dados = (await resposta.json()) as LookupResult
      onEncontrado(dados)
    } catch {
      setErro('Não foi possível consultar agora. Tente novamente em instantes.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <form onSubmit={buscar} className="flex w-full flex-col gap-4">
      <DialogPanel className="flex flex-col gap-4">
        <Field name="cpf">
          <FieldLabel htmlFor="cpf-busca">CPF</FieldLabel>
          <Input
            id="cpf-busca"
            name="cpf"
            autoComplete="off"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={(e) => setCpf(formatarCpf(e.target.value))}
            maxLength={14}
            autoFocus
          />
        </Field>
        <p className="text-muted-foreground text-xs">
          Vamos checar se esta pessoa já está cadastrada em outro curso da UFRRJ antes de criar um
          novo registro.
        </p>
        {erro && (
          <p className="flex items-start gap-2 text-destructive text-sm">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" /> {erro}
          </p>
        )}
      </DialogPanel>

      <DialogFooter>
        <DialogClose render={<Button variant="ghost" type="button" />}>Cancelar</DialogClose>
        <Button type="submit" disabled={!pronto || buscando}>
          {buscando ? <Loader2Icon className="animate-spin" /> : <SearchIcon />}{' '}
          {buscando ? 'Buscando…' : 'Continuar'}
        </Button>
      </DialogFooter>
    </form>
  )
}

function CadastrarNovo({
  cpfInicial,
  onSuccess,
  onVoltar,
}: {
  cpfInicial: string
  onSuccess: () => void
  onVoltar: () => void
}) {
  return (
    <Form route="gestao.egressos.store" resetOnSuccess onSuccess={onSuccess}>
      {({ processing }) => (
        <>
          <DialogPanel className="flex flex-col gap-4">
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
              <InfoIcon className="mt-0.5 size-4 text-muted-foreground" />
              <p>CPF não encontrado. Preencha os dados para criar um novo cadastro.</p>
            </div>

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
                <Input
                  id="cpf"
                  name="cpf"
                  autoComplete="off"
                  placeholder="000.000.000-00"
                  defaultValue={formatarCpf(cpfInicial)}
                  readOnly
                />
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
                    <SelectValue>
                      {(value) => SITUACOES.find((s) => s.value === value)?.label ?? ''}
                    </SelectValue>
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
            <Button variant="ghost" type="button" onClick={onVoltar}>
              <ArrowLeftIcon /> Voltar
            </Button>
            <Button type="submit" disabled={processing}>
              <UserPlusIcon /> {processing ? 'Cadastrando…' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Form>
  )
}

function VincularExistente({
  egresso,
  outrosCursos,
  onSuccess,
  onVoltar,
}: {
  egresso: { id: number; nome: string }
  outrosCursos: number
  onSuccess: () => void
  onVoltar: () => void
}) {
  return (
    <Form route="gestao.egressos.vincular" resetOnSuccess onSuccess={onSuccess}>
      {({ processing }) => (
        <>
          <DialogPanel className="flex flex-col gap-4">
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
              <CheckCircle2Icon className="mt-0.5 size-4 text-emerald-600" />
              <div className="flex flex-col gap-1">
                <p className="font-medium">{egresso.nome}</p>
                <p className="text-muted-foreground text-xs">
                  {outrosCursos > 0
                    ? 'Já está em outro curso da UFRRJ. Preencha o vínculo com o seu curso.'
                    : 'Cadastro existe, mas a pessoa ainda não está em nenhum curso. Vamos vincular.'}
                </p>
              </div>
            </div>

            <input type="hidden" name="egressoId" value={egresso.id} />

            <div className="grid grid-cols-2 gap-4">
              <Field name="matriculaCodigo">
                <FieldLabel htmlFor="vincular-matriculaCodigo">Matrícula</FieldLabel>
                <Input
                  id="vincular-matriculaCodigo"
                  name="matriculaCodigo"
                  autoComplete="off"
                  placeholder="2018212031"
                />
                <FieldError />
              </Field>

              <Field name="situacao">
                <FieldLabel>Situação</FieldLabel>
                <Select name="situacao" defaultValue="formado">
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value) => SITUACOES.find((s) => s.value === value)?.label ?? ''}
                    </SelectValue>
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
            </div>

            <Field name="periodoFormatura">
              <FieldLabel htmlFor="vincular-periodoFormatura">Turma</FieldLabel>
              <Input
                id="vincular-periodoFormatura"
                name="periodoFormatura"
                autoComplete="off"
                placeholder="2024.1"
              />
              <FieldError />
            </Field>
          </DialogPanel>

          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onVoltar}>
              <ArrowLeftIcon /> Voltar
            </Button>
            <Button type="submit" disabled={processing}>
              <UserPlusIcon /> {processing ? 'Vinculando…' : 'Vincular ao curso'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Form>
  )
}

function JaNoCurso({
  egresso,
  matricula,
  onFechar,
}: {
  egresso: { id: number; nome: string }
  matricula: { codigo: string; situacao: string; periodoFormatura: string | null }
  onFechar: () => void
}) {
  const situacaoLabel =
    SITUACOES.find((s) => s.value === matricula.situacao)?.label ?? matricula.situacao
  return (
    <>
      <DialogPanel className="flex flex-col gap-4">
        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
          <InfoIcon className="mt-0.5 size-4 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">{egresso.nome} já está neste curso.</p>
            <p className="text-muted-foreground text-xs tabular-nums">
              Matrícula {matricula.codigo} · {situacaoLabel}
              {matricula.periodoFormatura ? ` · ${matricula.periodoFormatura}` : ''}
            </p>
          </div>
        </div>
      </DialogPanel>
      <DialogFooter>
        <Button type="button" onClick={onFechar}>
          Fechar
        </Button>
      </DialogFooter>
    </>
  )
}
