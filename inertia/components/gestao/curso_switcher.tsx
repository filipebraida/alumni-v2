import { router, usePage } from '@inertiajs/react'
import { Check, ChevronsUpDownIcon, GraduationCap } from 'lucide-react'
import { urlFor } from '~/client'
import {
  Menu,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '~/components/ui/menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar'
import type { GestaoShared } from '~/components/gestao/types'

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
          <MenuTrigger render={<SidebarMenuButton size="lg" />}>
            <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium text-sm">
                {ativo?.nome ?? 'Selecione um curso'}
              </span>
              <span className="truncate text-muted-foreground text-xs">
                {ativo ? `${ativo.nivel} · ${ativo.campus}` : '—'}
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4 opacity-70" />
          </MenuTrigger>
          <MenuPopup align="start" className="min-w-56">
            <MenuGroupLabel>Meus cursos</MenuGroupLabel>
            {cursos.map((curso) => (
              <MenuItem key={curso.id} onClick={() => trocar(curso.id)}>
                <GraduationCap className="size-4 opacity-70" />
                <div className="grid flex-1 leading-tight">
                  <span className="truncate text-sm">{curso.nome}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {curso.nivel} · {curso.campus}
                  </span>
                </div>
                {curso.id === cursoAtivoId && <Check className="size-4" />}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
