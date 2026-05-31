import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeftIcon, Building2, Layers, ShieldUser, Users } from 'lucide-react'
import { type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { type InertiaProps } from '~/types'

type NivelAcademico = 'graduacao' | 'especializacao' | 'mba' | 'mestrado' | 'doutorado' | 'posdoc'

type Modalidade = 'academico' | 'profissional'

const NIVEL_LABELS: Record<NivelAcademico, string> = {
  graduacao: 'Graduação',
  especializacao: 'Especialização',
  mba: 'MBA',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
  posdoc: 'Pós-doutorado',
}

const MODALIDADE_LABELS: Record<Modalidade, string> = {
  academico: 'Acadêmico',
  profissional: 'Profissional',
}

type CoordenadorBreve = {
  id: number
  nomeCompleto: string
  cargo: string | null
  email: string
}

type CursoDetalhe = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  programa: {
    id: number
    codigo: string
    nome: string
    sigla: string | null
    modalidade: Modalidade | null
  } | null
  totalMatriculas: number
  coordenadores: CoordenadorBreve[]
}

type PageProps = InertiaProps<{ curso: CursoDetalhe }>

export default function AdminCursoShow({ curso }: PageProps) {
  return (
    <>
      <Head title={`Curso · ${curso.nome}`} />

      <GestaoPage>
        <GestaoPageHeader
          titulo={curso.nome}
          subtitulo={
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wide">{curso.codigo}</span>
              <span className="text-xs">· {NIVEL_LABELS[curso.nivel]}</span>
              <Badge variant={curso.ativo ? 'success' : 'outline'}>
                {curso.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </span>
          }
          acoes={
            <Button variant="ghost" size="sm" render={<Link href={urlFor('admin.cursos')} />}>
              <ArrowLeftIcon /> Voltar
            </Button>
          }
        />

        {/* Estatísticas no futuro (matriculas por situação, frescor de respostas, etc.) */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Matrículas" valor={curso.totalMatriculas} />
          <Stat label="Coordenadores" valor={curso.coordenadores.length} />
        </section>

        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Building2 className="size-4" />
            </span>
            <h2 className="font-heading font-semibold text-lg">Instituto</h2>
          </header>
          <Link
            href={urlFor('admin.institutos.show', { id: curso.institutoId })}
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-sm">{curso.institutoNome}</div>
              <div className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {curso.institutoCodigo}
              </div>
            </div>
          </Link>
        </section>

        {curso.programa && (
          <section className="flex flex-col gap-3">
            <header className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Layers className="size-4" />
              </span>
              <h2 className="font-heading font-semibold text-lg">Programa</h2>
            </header>
            <Link
              href={urlFor('admin.programas.show', { id: curso.programa.id })}
              className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-sm">{curso.programa.nome}</div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="font-mono">{curso.programa.sigla ?? curso.programa.codigo}</span>
                  {curso.programa.modalidade && (
                    <span>· {MODALIDADE_LABELS[curso.programa.modalidade]}</span>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ShieldUser className="size-4" />
            </span>
            <h2 className="font-heading font-semibold text-lg">Coordenadores</h2>
            <span className="text-muted-foreground text-sm tabular-nums">
              ({curso.coordenadores.length})
            </span>
          </header>
          {curso.coordenadores.length === 0 ? (
            <p className="rounded-md border border-dashed bg-muted/20 p-4 text-center text-muted-foreground text-sm">
              Nenhum coordenador vinculado.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {curso.coordenadores.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-sm">{c.nomeCompleto}</div>
                    <div className="truncate text-muted-foreground text-xs">{c.email}</div>
                  </div>
                  {c.cargo && <span className="text-muted-foreground text-xs">{c.cargo}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Users className="size-4" />
            </span>
            <h2 className="font-heading font-semibold text-lg">Matrículas</h2>
          </header>
          <p className="rounded-md border border-dashed bg-muted/20 p-4 text-center text-muted-foreground text-sm">
            {curso.totalMatriculas === 0
              ? 'Nenhuma matrícula registrada.'
              : `${curso.totalMatriculas} matrícula(s) registrada(s). Visualização detalhada em "Egressos".`}
          </p>
        </section>
      </GestaoPage>
    </>
  )
}

AdminCursoShow.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function Stat({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="text-muted-foreground text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-1 font-semibold text-2xl tabular-nums">{valor}</div>
    </div>
  )
}
