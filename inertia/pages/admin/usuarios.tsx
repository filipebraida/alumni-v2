import { Head, usePage } from '@inertiajs/react'
import { Users } from 'lucide-react'
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
import { UsuarioDialog, type CursoOption } from '~/components/admin/usuario_dialog'
import { type InertiaProps } from '~/types'
import { type Data } from '@generated/data'

type UsuarioRow = {
  id: number
  fullName: string | null
  email: string
  role: 'usuario' | 'admin'
  cursosCoordenados: { id: number; codigo: string; nome: string }[]
}

type PageProps = InertiaProps<{
  usuarios: UsuarioRow[]
  cursos: CursoOption[]
}>

export default function AdminUsuarios({ usuarios, cursos }: PageProps) {
  const { user } = usePage<Data.SharedProps>().props
  const meuId = user?.id

  const totalAdmins = usuarios.filter((u) => u.role === 'admin').length

  return (
    <>
      <Head title="Administração · Usuários" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Usuários"
          subtitulo="Quem acessa o SAE. Marque como administrador e/ou vincule a um ou mais cursos como coordenador."
          acoes={<UsuarioDialog modo="criar" cursos={cursos} />}
        />

        {usuarios.length === 0 ? (
          <EstadoVazio />
        ) : (
          <div className="rounded-xl border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Cursos coordenados</TableHead>
                  <TableHead className="text-end">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => {
                  const ehVoceMesmo = usuario.id === meuId
                  const ultimoAdmin = usuario.role === 'admin' && totalAdmins === 1

                  return (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.fullName ?? '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{usuario.email}</TableCell>
                      <TableCell>
                        {usuario.role === 'admin' ? (
                          <Badge variant="success">Admin</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {usuario.cursosCoordenados.length === 0 ? (
                          <span className="text-muted-foreground text-sm">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {usuario.cursosCoordenados.map((curso) => (
                              <Badge
                                key={curso.id}
                                variant="outline"
                                title={curso.nome}
                                className="font-mono text-xs"
                              >
                                {curso.codigo}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-end">
                        <UsuarioDialog
                          modo="editar"
                          cursos={cursos}
                          bloqueiaTirarAdmin={ehVoceMesmo || ultimoAdmin}
                          usuario={{
                            id: usuario.id,
                            fullName: usuario.fullName,
                            email: usuario.email,
                            role: usuario.role,
                            cursosIds: usuario.cursosCoordenados.map((c) => c.id),
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </GestaoPage>
    </>
  )
}

AdminUsuarios.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function EstadoVazio() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-background py-14 text-center">
      <Users className="size-8 text-muted-foreground" />
      <div>
        <p className="font-medium text-sm">Nenhum usuário cadastrado.</p>
        <p className="mt-1 text-muted-foreground text-xs">
          Clique em "Novo usuário" para começar.
        </p>
      </div>
    </div>
  )
}
