import { Head, Link } from '@inertiajs/react'
import { ArrowLeftIcon, Building2, GraduationCap } from 'lucide-react'
import { type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { type InertiaProps } from '~/types'

type NivelAcademico =
  | 'graduacao'
  | 'especializacao'
  | 'mba'
  | 'mestrado'
  | 'doutorado'
  | 'posdoc'

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

type CursoBreve = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
}

type ProgramaDetalhe = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: Modalidade | null
  ativo: boolean
  institutoId: number
  institutoCodigo: string
  institutoNome: string
  totalCursos: number
  cursos: CursoBreve[]
}

type PageProps = InertiaProps<{ programa: ProgramaDetalhe }>

export default function AdminProgramaShow({ programa }: PageProps) {
  return (
    <>
      <Head title={`Programa · ${programa.nome}`} />

      <GestaoPage>
        <GestaoPageHeader
          titulo={programa.nome}
          subtitulo={
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wide">{programa.codigo}</span>
              {programa.modalidade && (
                <span className="text-xs">· {MODALIDADE_LABELS[programa.modalidade]}</span>
              )}
              <Badge variant={programa.ativo ? 'success' : 'outline'}>
                {programa.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </span>
          }
          acoes={
            <Button variant="ghost" size="sm" render={<Link href={urlFor('admin.programas')} />}>
              <ArrowLeftIcon /> Voltar
            </Button>
          }
        />

        {/* Espaço pra estatísticas no futuro */}

        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Building2 className="size-4" />
            </span>
            <h2 className="font-heading font-semibold text-lg">Instituto</h2>
          </header>
          <Link
            href={urlFor('admin.institutos.show', { id: programa.institutoId })}
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
          >
            <div>
              <div className="font-medium text-sm">{programa.institutoNome}</div>
              <div className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {programa.institutoCodigo}
              </div>
            </div>
          </Link>
        </section>

        <section className="flex flex-col gap-3">
          <header className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <GraduationCap className="size-4" />
            </span>
            <h2 className="font-heading font-semibold text-lg">Cursos</h2>
            <span className="text-muted-foreground text-sm tabular-nums">
              ({programa.totalCursos})
            </span>
          </header>
          {programa.totalCursos === 0 ? (
            <p className="rounded-md border border-dashed bg-muted/20 p-4 text-center text-muted-foreground text-sm">
              Nenhum curso vinculado. Cadastre mestrado e/ou doutorado em "Cursos".
            </p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {programa.cursos.map((c) => (
                <Link
                  key={c.id}
                  href={urlFor('admin.cursos.show', { id: c.id })}
                  className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-sm">{c.nome}</div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <span className="font-mono uppercase">{c.codigo}</span>
                      <span>· {NIVEL_LABELS[c.nivel]}</span>
                    </div>
                  </div>
                  <Badge variant={c.ativo ? 'success' : 'outline'}>
                    {c.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </GestaoPage>
    </>
  )
}

AdminProgramaShow.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>
