import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type Gestor from '#models/gestor'
import type Curso from '#models/curso'
import BuscarGestorDoUsuario from '#queries/buscar_gestor_do_usuario'
import ListarTodosOsCursos from '#queries/listar_todos_os_cursos'
import { IS_ADMIN_KEY, IS_EGRESSO_KEY } from '#controllers/session_controller'
import { NIVEL_LABELS } from '#enums/nivel_academico'

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
    const isAdmin = ctx.session.get(IS_ADMIN_KEY, false) as boolean

    const gestor = await new BuscarGestorDoUsuario().handle({ userId: user.id })
    const cursos = isAdmin ? await new ListarTodosOsCursos().handle() : (gestor?.cursos ?? [])

    if (cursos.length === 0) {
      ctx.session.flash('error', 'Área restrita à coordenação de curso.')
      const isEgresso = ctx.session.get(IS_EGRESSO_KEY, false)
      return ctx.response.redirect().toRoute(isEgresso ? 'dashboard' : 'home')
    }

    const salvo = ctx.session.get(CURSO_GESTAO_ATIVO_KEY, null)
    const cursoAtivo = cursos.find((curso) => curso.id === salvo) ?? cursos[0] ?? null
    if (cursoAtivo && cursoAtivo.id !== salvo) {
      ctx.session.put(CURSO_GESTAO_ATIVO_KEY, cursoAtivo.id)
    }

    ctx.gestao = { gestor: gestor ?? null, cursos, cursoAtivo, isAdmin }
    ctx.inertia.share({
      gestao: {
        cursoAtivoId: cursoAtivo?.id ?? null,
        isAdmin,
        cursos: cursos.map((curso) => ({
          id: curso.id,
          nome: curso.nome,
          codigo: curso.codigo,
          nivel: NIVEL_LABELS[curso.nivel],
          instituto: curso.instituto.nome,
        })),
      },
    })

    return next()
  }
}
