import { router, usePage } from '@inertiajs/react'
import { Check, ChevronsUpDownIcon, GraduationCap } from 'lucide-react'
import { urlFor } from '~/client'
import { cn } from '~/lib/utils'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '~/components/ui/menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar'
import type { CursoResumo, GestaoShared } from '~/components/gestao/types'

function iniciaisCurso(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .filter((palavra) => palavra.length > 2)
    .map((palavra) => palavra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function CursoBadge({ curso, className }: { curso: CursoResumo | null; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-bold text-sidebar-primary-foreground text-xs group-data-[collapsible=icon]:size-8',
        className
      )}
    >
      {curso ? iniciaisCurso(curso.nome) : <GraduationCap className="size-4" />}
    </span>
  )
}

/**
 * Seletor de curso no topo da sidebar (padrão "tenant/team switcher"): o curso
 * é o workspace da gestão. Trocar = PUT em `gestao.curso_ativo`, que grava na
 * sessão; a página recarrega já escopada no novo curso.
 */
export function CursoSwitcher() {
  const { gestao } = usePage<{ gestao: GestaoShared }>().props
  const { cursos, cursoAtivoId } = gestao
  const ativo = cursos.find((curso) => curso.id === cursoAtivoId) ?? null

  function trocar(cursoId: number) {
    if (cursoId === cursoAtivoId) return
    router.put(urlFor('gestao.curso_ativo'), { cursoId }, { preserveScroll: true })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={ativo?.nome ?? 'Selecione um curso'}
                className="border border-sidebar-border bg-sidebar-accent hover:bg-sidebar-accent/70 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent"
              />
            }
          >
            <CursoBadge curso={ativo} />
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sidebar-foreground/55 text-xs uppercase tracking-wide">
                {ativo?.nivel ?? 'Gestão'}
              </span>
              <span className="truncate font-semibold text-sm">
                {ativo?.nome ?? 'Selecione um curso'}
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4 shrink-0 opacity-70 group-data-[collapsible=icon]:hidden" />
          </MenuTrigger>
          <MenuPopup align="start" className="min-w-56">
            <MenuGroup>
              <MenuGroupLabel>Meus cursos</MenuGroupLabel>
              {cursos.map((curso) => (
                <MenuItem key={curso.id} onClick={() => trocar(curso.id)}>
                  <GraduationCap className="size-4 opacity-70" />
                  <div className="grid flex-1 leading-tight">
                    <span className="truncate text-sm">{curso.nome}</span>
                    <span className="truncate text-muted-foreground text-xs">
                      {curso.nivel} · {curso.instituto}
                    </span>
                  </div>
                  {curso.id === cursoAtivoId && <Check className="size-4" />}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
