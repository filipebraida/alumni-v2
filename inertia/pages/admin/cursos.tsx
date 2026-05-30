import { Head } from '@inertiajs/react'
import { GraduationCap } from 'lucide-react'
import { type ReactElement } from 'react'

import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import {
  CriarCursoDialog,
  type InstitutoOption,
} from '~/components/admin/criar_curso_dialog'
import { type InertiaProps } from '~/types'

type NivelAcademico =
  | 'graduacao'
  | 'especializacao'
  | 'mba'
  | 'mestrado'
  | 'doutorado'
  | 'posdoc'

const NIVEL_LABELS: Record<NivelAcademico, string> = {
  graduacao: 'Graduação',
  especializacao: 'Especialização',
  mba: 'MBA',
  mestrado: 'Mestrado',
  doutorado: 'Doutorado',
  posdoc: 'Pós-doutorado',
}

type CursoRow = {
  id: number
  codigo: string
  nome: string
  nivel: NivelAcademico
  ativo: boolean
  instituto: { id: number; nome: string; codigo: string }
}

type PageProps = InertiaProps<{
  cursos: CursoRow[]
  institutos: InstitutoOption[]
}>

export default function AdminCursos({ cursos, institutos }: PageProps) {
  const subtitulo =
    institutos.length === 0
      ? 'Cadastre um instituto antes de criar cursos.'
      : 'Catálogo de cursos da UFRRJ. Cada curso pertence a um instituto.'

  return (
    <>
      <Head title="Administração · Cursos" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Cursos"
          subtitulo={subtitulo}
          acoes={<CriarCursoDialog institutos={institutos} />}
        />

        {cursos.length === 0 ? (
          <EstadoVazio />
        ) : (
          <div className="rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Instituto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cursos.map((curso) => (
                  <TableRow key={curso.id}>
                    <TableCell className="font-mono text-xs uppercase tracking-wide">
                      {curso.codigo}
                    </TableCell>
                    <TableCell className="font-medium">{curso.nome}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {NIVEL_LABELS[curso.nivel]}
                    </TableCell>
                    <TableCell className="text-sm">
                      {curso.instituto.nome}{' '}
                      <span className="text-muted-foreground text-xs">
                        · {curso.instituto.codigo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={curso.ativo ? 'success' : 'outline'}>
                        {curso.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </GestaoPage>
    </>
  )
}

AdminCursos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function EstadoVazio() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-background py-14 text-center">
      <GraduationCap className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium text-sm">Nenhum curso cadastrado.</p>
        <p className="mt-1 text-muted-foreground text-xs">
          Clique em "Novo curso" para começar.
        </p>
      </div>
    </div>
  )
}
