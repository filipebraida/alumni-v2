import { Head, Link } from '@inertiajs/react'
import { ArrowLeftIcon, GraduationCap, Layers } from 'lucide-react'
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

type ProgramaBreve = {
  id: number
  codigo: string
  nome: string
  sigla: string | null
  modalidade: Modalidade | null
  ativo: boolean
}

type InstitutoDetalhe = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
  totalProgramas: number
  cursos: CursoBreve[]
  programas: ProgramaBreve[]
}

type PageProps = InertiaProps<{ instituto: InstitutoDetalhe }>

export default function AdminInstitutoShow({ instituto }: PageProps) {
  return (
    <>
      <Head title={`Instituto · ${instituto.nome}`} />

      <GestaoPage>
        <GestaoPageHeader
          titulo={instituto.nome}
          subtitulo={
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wide">{instituto.codigo}</span>
              <Badge variant={instituto.ativo ? 'success' : 'outline'}>
                {instituto.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </span>
          }
          acoes={
            <Button variant="ghost" size="sm" render={<Link href={urlFor('admin.institutos')} />}>
              <ArrowLeftIcon /> Voltar
            </Button>
          }
        />

        {/* Espaço pra estatísticas no futuro */}

        <Secao
          titulo="Programas"
          icone={<Layers />}
          total={instituto.totalProgramas}
          vazio="Nenhum programa vinculado."
        >
          {instituto.programas.map((p) => (
            <Link
              key={p.id}
              href={urlFor('admin.programas.show', { id: p.id })}
              className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-sm">{p.nome}</div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <span className="font-mono">{p.sigla ?? p.codigo}</span>
                  {p.modalidade && <span>· {MODALIDADE_LABELS[p.modalidade]}</span>}
                </div>
              </div>
              <Badge variant={p.ativo ? 'success' : 'outline'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </Link>
          ))}
        </Secao>

        <Secao
          titulo="Cursos"
          icone={<GraduationCap />}
          total={instituto.totalCursos}
          vazio="Nenhum curso vinculado."
        >
          {instituto.cursos.map((c) => (
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
              <Badge variant={c.ativo ? 'success' : 'outline'}>{c.ativo ? 'Ativo' : 'Inativo'}</Badge>
            </Link>
          ))}
        </Secao>
      </GestaoPage>
    </>
  )
}

AdminInstitutoShow.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function Secao({
  titulo,
  icone,
  total,
  vazio,
  children,
}: {
  titulo: string
  icone: ReactElement
  total: number
  vazio: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:size-4">
          {icone}
        </span>
        <h2 className="font-heading font-semibold text-lg">{titulo}</h2>
        <span className="text-muted-foreground text-sm tabular-nums">({total})</span>
      </header>
      {total === 0 ? (
        <p className="rounded-md border border-dashed bg-muted/20 p-4 text-center text-muted-foreground text-sm">
          {vazio}
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">{children}</div>
      )}
    </section>
  )
}
