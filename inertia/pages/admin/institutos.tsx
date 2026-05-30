import { Head } from '@inertiajs/react'
import { Building2 } from 'lucide-react'
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
import { CriarInstitutoDialog } from '~/components/admin/criar_instituto_dialog'
import { type InertiaProps } from '~/types'

type InstitutoRow = {
  id: number
  codigo: string
  nome: string
  ativo: boolean
  totalCursos: number
}

type PageProps = InertiaProps<{
  institutos: InstitutoRow[]
}>

export default function AdminInstitutos({ institutos }: PageProps) {
  return (
    <>
      <Head title="Administração · Institutos" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Institutos"
          subtitulo="Unidades da UFRRJ. Cada curso pertence a um instituto."
          acoes={<CriarInstitutoDialog />}
        />

        {institutos.length === 0 ? (
          <EstadoVazio />
        ) : (
          <div className="rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-end">Cursos</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutos.map((instituto) => (
                  <TableRow key={instituto.id}>
                    <TableCell className="font-mono text-xs uppercase tracking-wide">
                      {instituto.codigo}
                    </TableCell>
                    <TableCell className="font-medium">{instituto.nome}</TableCell>
                    <TableCell className="text-end tabular-nums">{instituto.totalCursos}</TableCell>
                    <TableCell>
                      <Badge variant={instituto.ativo ? 'success' : 'outline'}>
                        {instituto.ativo ? 'Ativo' : 'Inativo'}
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

AdminInstitutos.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function EstadoVazio() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-background py-14 text-center">
      <Building2 className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium text-sm">Nenhum instituto cadastrado.</p>
        <p className="mt-1 text-muted-foreground text-xs">
          Clique em "Novo instituto" para começar.
        </p>
      </div>
    </div>
  )
}
