import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type Gestor from '#models/gestor'
import type Curso from '#models/curso'
import ListarTodosOsCursos from '#queries/listar_todos_os_cursos'
import { loadPerfilFlags } from '#services/perfil_flags'

/** Chave de sessão do curso ativo na área de gestão. */
export const CURSO_GESTAO_ATIVO_KEY = 'cursoGestaoAtivo'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    gestao: { gestor: Gestor | null; cursos: Curso[]; cursoAtivo: Curso | null; isAdmin: boolean }
  }
}

/**
 * Porta da área de gestão. Resolve o conjunto de cursos visíveis (gestor = só
 * os da pivot; admin = todos os cursos da UFRRJ), elege o curso ativo (sessão
 * → 1º curso, com fallback se o salvo sair do conjunto) e disponibiliza
 * tudo para controllers (`ctx.gestao`) e para o frontend (shared prop
 * `gestao`, que alimenta o CursoSwitcher). Roda depois do `auth`.
 */
export default class GestorMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()
    await loadPerfilFlags(user)

    if (!user.isGestor) {
      ctx.session.flash('error', 'Área restrita à coordenação de curso.')
      return ctx.response.redirect().toRoute(user.isEgresso ? 'dashboard' : 'home')
    }

    // Admin vê todos os cursos da UFRRJ; gestor regular vê só os da própria
    // pivot. `loadFlags` já preloadou `gestor.cursos`, mas precisamos do
    // instituto pra exibir no switcher — recarrega só nesse caso.
    const isAdmin = user.isAdmin
    let cursos: Curso[]
    if (isAdmin) {
      cursos = await new ListarTodosOsCursos().handle()
    } else {
      await user.gestor.load('cursos', (c) => c.preload('instituto'))
      cursos = user.gestor.cursos
    }
    const gestor = user.gestor ?? null

    const salvo = ctx.session.get(CURSO_GESTAO_ATIVO_KEY, null)
    const cursoAtivo = cursos.find((curso) => curso.id === salvo) ?? cursos[0] ?? null
    if (cursoAtivo && cursoAtivo.id !== salvo) {
      ctx.session.put(CURSO_GESTAO_ATIVO_KEY, cursoAtivo.id)
    }

    // `ctx.gestao` é lido pelo InertiaMiddleware.share() pra projetar o shared
    // prop `gestao` (typado via InferSharedProps).
    ctx.gestao = { gestor, cursos, cursoAtivo, isAdmin }

    return next()
  }
}
