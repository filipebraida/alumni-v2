import { Head, router, usePage } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { SearchIcon, Users } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'

import { urlFor } from '~/client'
import GestaoLayout from '~/layouts/gestao'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data_table'
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from '~/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input_group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { GestaoPage, GestaoPageHeader } from '~/components/gestao/gestao_page'
import { UsuarioDialog, type CursoOption } from '~/components/admin/usuario_dialog'
import { useDataTable, type PaginatorMeta } from '~/hooks/use_data_table'
import { type InertiaProps } from '~/types'
import { type Data } from '@generated/data'

type TipoFiltro = 'admin' | 'coordenador' | 'sem_papel'

const TIPO_LABEL: Record<TipoFiltro, string> = {
  admin: 'Administradores',
  coordenador: 'Coordenadores',
  sem_papel: 'Sem papel',
}

const TODOS = '_todos'

type UsuarioRow = {
  id: number
  fullName: string | null
  email: string
  role: 'usuario' | 'admin'
  cursosCoordenados: { id: number; codigo: string; nome: string }[]
}

type Filtros = {
  q: string | null
  tipo: TipoFiltro | null
}

type PageProps = InertiaProps<{
  usuarios: { data: UsuarioRow[]; metadata: PaginatorMeta }
  cursos: CursoOption[]
  filtros: Filtros
}>

export default function AdminUsuarios({ usuarios, cursos, filtros }: PageProps) {
  const { user } = usePage<Data.SharedProps>().props
  const meuId = user?.id

  const totalAdmins = usuarios.data.filter((u) => u.role === 'admin').length
  const algumFiltro = !!(filtros.q || filtros.tipo)
  const semDados = usuarios.data.length === 0 && !algumFiltro && usuarios.metadata.total === 0

  const colunas: ColumnDef<UsuarioRow>[] = [
    {
      id: 'nome',
      header: 'Nome',
      cell: ({ row }) => <span className="font-medium">{row.original.fullName ?? '—'}</span>,
    },
    {
      id: 'email',
      header: 'E-mail',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.email}</span>
      ),
    },
    {
      id: 'admin',
      header: 'Admin',
      cell: ({ row }) =>
        row.original.role === 'admin' ? (
          <Badge variant="success">Admin</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    {
      id: 'cursos',
      header: 'Cursos coordenados',
      cell: ({ row }) => {
        const lista = row.original.cursosCoordenados
        if (lista.length === 0) return <span className="text-muted-foreground text-sm">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {lista.map((curso) => (
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
        )
      },
    },
    {
      id: 'acoes',
      header: () => <span className="block text-end">Ações</span>,
      cell: ({ row }) => {
        const usuario = row.original
        const ehVoceMesmo = usuario.id === meuId
        const ultimoAdmin = usuario.role === 'admin' && totalAdmins === 1
        return (
          <div className="text-end">
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
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Head title="Administração · Usuários" />

      <GestaoPage>
        <GestaoPageHeader
          titulo="Usuários"
          subtitulo="Quem acessa o SAE. Marque como administrador e/ou vincule a um ou mais cursos como coordenador."
          acoes={<UsuarioDialog modo="criar" cursos={cursos} />}
        />

        {semDados ? (
          <EstadoVazio />
        ) : (
          <>
            <FiltrosBar filtros={filtros} perPage={usuarios.metadata.perPage} />
            <UsuariosDataTable
              usuarios={usuarios}
              filtros={filtros}
              colunas={colunas}
              algumFiltro={algumFiltro}
            />
          </>
        )}
      </GestaoPage>
    </>
  )
}

AdminUsuarios.layout = (page: ReactElement) => <GestaoLayout>{page}</GestaoLayout>

function UsuariosDataTable({
  usuarios,
  filtros,
  colunas,
  algumFiltro,
}: {
  usuarios: { data: UsuarioRow[]; metadata: PaginatorMeta }
  filtros: Filtros
  colunas: ColumnDef<UsuarioRow>[]
  algumFiltro: boolean
}) {
  const remoteTableOptions = useDataTable({
    data: usuarios,
    visit: ({ page, perPage }) =>
      router.get(
        urlFor('admin.usuarios'),
        {
          page,
          perPage,
          q: filtros.q ?? undefined,
          tipo: filtros.tipo ?? undefined,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['usuarios', 'filtros'],
        }
      ),
  })

  return (
    <DataTable
      columns={colunas}
      data={usuarios.data}
      remoteTableOptions={remoteTableOptions}
      paginationVariant="numbered"
      emptyMessage={
        algumFiltro ? 'Nenhum usuário bate com os filtros.' : 'Nenhum usuário cadastrado.'
      }
    />
  )
}

function FiltrosBar({ filtros, perPage }: { filtros: Filtros; perPage: number }) {
  const [busca, setBusca] = useState(filtros.q ?? '')

  const aplicar = useCallback(
    (proxQ: string, proxTipo: string) => {
      router.get(
        urlFor('admin.usuarios'),
        {
          q: proxQ.length > 0 ? proxQ : undefined,
          tipo: proxTipo === TODOS ? undefined : proxTipo,
          perPage,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['usuarios', 'filtros'],
        }
      )
    },
    [perPage]
  )

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  const tipoValor = filtros.tipo ?? TODOS
  const algumAtivo = !!(filtros.q || filtros.tipo)

  function aoBuscar(valor: string) {
    setBusca(valor)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => aplicar(valor, tipoValor), 300)
  }

  function limpar() {
    setBusca('')
    aplicar('', TODOS)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full sm:w-72">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          name="busca-usuarios"
          value={busca}
          onChange={(e) => aoBuscar(e.target.value)}
          placeholder="Buscar por nome ou e-mail…"
          autoComplete="off"
        />
      </InputGroup>

      <Select value={tipoValor} onValueChange={(v) => aplicar(busca, v ?? TODOS)}>
        <SelectTrigger className="w-44">
          <SelectValue>
            {(v) => (!v || v === TODOS ? 'Todos os papéis' : TIPO_LABEL[v as TipoFiltro])}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS}>Todos os papéis</SelectItem>
          {(Object.keys(TIPO_LABEL) as TipoFiltro[]).map((tipo) => (
            <SelectItem key={tipo} value={tipo}>
              {TIPO_LABEL[tipo]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {algumAtivo && (
        <Button variant="ghost" size="sm" onClick={limpar}>
          Limpar
        </Button>
      )}
    </div>
  )
}

function EstadoVazio() {
  return (
    <Empty>
      <EmptyMedia variant="icon">
        <Users />
      </EmptyMedia>
      <EmptyContent>
        <EmptyTitle>Nenhum usuário cadastrado.</EmptyTitle>
        <EmptyDescription>Use "Novo usuário" para começar.</EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
