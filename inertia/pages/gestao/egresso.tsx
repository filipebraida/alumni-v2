import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react'
import { type ReactElement, type ReactNode } from 'react'

import { urlFor } from '~/client'
import { cn } from '~/lib/utils'
import { formatarCpf } from '~/lib/cpf'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { type InertiaProps } from '~/types'

type Situacao = 'cursando' | 'formado' | 'evadido'
type StatusFrescor = 'em_dia' | 'desatualizado' | 'sem_registro'

const SITUACAO_LABEL: Record<Situacao, string> = {
  cursando: 'Cursando',
  formado: 'Formado',
  evadido: 'Evadido',
}

const SITUACAO_VARIANT: Record<Situacao, 'success' | 'info' | 'outline'> = {
  cursando: 'info',
  formado: 'success',
  evadido: 'outline',
}

const FRESCOR_LABEL: Record<StatusFrescor, string> = {
  em_dia: 'Em dia',
  desatualizado: 'Desatualizado',
  sem_registro: 'Sem registro',
}

const FRESCOR_DOT: Record<StatusFrescor, string> = {
  em_dia: 'bg-success',
  desatualizado: 'bg-warning',
  sem_registro: 'bg-muted-foreground/40',
}

type Egresso = {
  id: number
  nomeCompleto: string
  cpf: string
  emailLogin: string | null
  emailPessoal: string | null
  consentimentoEm: string | null
}

type Matricula = {
  codigo: string
  situacao: Situacao
  periodoFormatura: string | null
  dataColacao: string | null
  curso: { nome: string; codigo: string; nivel: string; instituto: string }
}

type RespostaAtual = {
  ano: number
  registradaEm: string | null
  localizacao: string | null
  empregador: string | null
  cargo: string | null
  setor: string | null
  // Campos por-matrícula (faixa salarial, relação com a formação, tempo até
  // 1º emprego, pós-graduação) saíram pra `RespostaCurso` no split D1 e
  // ainda não estão wired nesta tela da gestão. Quando voltar, vir via
  // RespostaCursoTransformer escopado pela matrícula do detalhe.
}

type PageProps = InertiaProps<{
  egresso: Egresso
  matricula: Matricula
  respostaAtual: RespostaAtual | null
  statusFrescor: StatusFrescor
}>

function iniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .map((palavra) => palavra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatarDataIso(iso: string | null) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export default function EgressoPerfil({
  egresso,
  matricula,
  respostaAtual,
  statusFrescor,
}: PageProps) {
  return (
    <>
      <Head title={`${egresso.nomeCompleto} · Egresso`} />

      <GestaoPage>
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link href={urlFor('gestao.egressos')} className="-ms-2 w-fit text-muted-foreground">
              <ArrowLeftIcon /> Voltar para egressos
            </Link>
          }
        />

        <GestaoPageHeader
          titulo={
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary font-semibold text-primary-foreground text-lg">
                {iniciais(egresso.nomeCompleto)}
              </span>
              <span className="min-w-0 truncate">{egresso.nomeCompleto}</span>
            </div>
          }
          subtitulo={
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>CPF {formatarCpf(egresso.cpf)}</span>
              {egresso.consentimentoEm && (
                <Badge variant="success" className="gap-1">
                  <ShieldCheckIcon className="size-3" /> Confirmou identidade
                </Badge>
              )}
            </span>
          }
        />

        <Bloco titulo="Contato">
          <Linha rotulo="E-mail de login" valor={egresso.emailLogin} />
          <Linha rotulo="E-mail pessoal" valor={egresso.emailPessoal} />
        </Bloco>

        <Bloco titulo={`Matrícula em ${matricula.curso.nome}`}>
          <Linha rotulo="Código" valor={matricula.codigo} mono />
          <Linha
            rotulo="Situação"
            valor={
              <Badge variant={SITUACAO_VARIANT[matricula.situacao]} className="gap-1.5">
                <span className="size-1.5 rounded-full bg-current" />
                {SITUACAO_LABEL[matricula.situacao]}
              </Badge>
            }
          />
          <Linha rotulo="Turma" valor={matricula.periodoFormatura} />
          <Linha rotulo="Colação" valor={formatarDataIso(matricula.dataColacao)} />
          <Linha
            rotulo="Questionário"
            valor={
              <span className="inline-flex items-center gap-1.5">
                <span className={cn('size-1.5 rounded-full', FRESCOR_DOT[statusFrescor])} />
                {FRESCOR_LABEL[statusFrescor]}
              </span>
            }
          />
        </Bloco>

        <Bloco
          titulo="Última foto"
          extra={
            respostaAtual?.registradaEm && (
              <span className="text-muted-foreground text-xs">
                Registrada em {formatarDataIso(respostaAtual.registradaEm)} · ano de referência{' '}
                {respostaAtual.ano}
              </span>
            )
          }
        >
          {!respostaAtual ? (
            <p className="text-muted-foreground text-sm">
              Esta pessoa ainda não respondeu o questionário do SAE.
            </p>
          ) : (
            <>
              <Linha rotulo="Localização" valor={respostaAtual.localizacao} />
              <Linha rotulo="Empregador" valor={respostaAtual.empregador} />
              <Linha rotulo="Cargo" valor={respostaAtual.cargo} />
              <Linha rotulo="Setor" valor={respostaAtual.setor} />
              {/* Campos por matrícula (faixa salarial, relação com a formação,
                  tempo até 1º emprego, pós-graduação) migraram para RespostaCurso
                  no split D1 e serão re-introduzidos via um agregador
                  por matrícula em change própria. */}
            </>
          )}
        </Bloco>
      </GestaoPage>
    </>
  )
}

EgressoPerfil.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function Bloco({
  titulo,
  extra,
  children,
}: {
  titulo: ReactNode
  extra?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border bg-background p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-medium text-sm tracking-tight">{titulo}</h2>
        {extra}
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function Linha({ rotulo, valor, mono }: { rotulo: string; valor: ReactNode; mono?: boolean }) {
  const vazio = valor === null || valor === undefined || valor === ''
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-xs uppercase tracking-wide">{rotulo}</dt>
      <dd
        className={cn(
          'mt-0.5 truncate text-sm',
          mono && 'font-mono text-xs uppercase tracking-wide',
          vazio && 'text-muted-foreground'
        )}
      >
        {vazio ? '—' : valor}
      </dd>
    </div>
  )
}
