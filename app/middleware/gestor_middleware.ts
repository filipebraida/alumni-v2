import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type Gestor from '#models/gestor'
import type Curso from '#models/curso'
import BuscarGestorDoUsuario from '#queries/buscar_gestor_do_usuario'
import { IS_EGRESSO_KEY } from '#controllers/session_controller'
import { NIVEL_LABELS } from '#enums/nivel_academico'
import { CAMPUS_LABELS } from '#enums/campus'

/** Chave de sessão do curso ativo na área de gestão. */
export const CURSO_GESTAO_ATIVO_KEY = 'cursoGestaoAtivo'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    gestao: { gestor: Gestor; cursoAtivo: Curso | null }
  }
}

/**
 * Porta da área de gestão. Exige que o usuário seja gestor, resolve o curso
 * ativo (sessão → 1º curso, com fallback se o salvo não for mais gerido) e o
 * disponibiliza para controllers (`ctx.gestao`) e para o frontend (shared prop
 * `gestao`, que alimenta o CursoSwitcher). Roda depois do `auth`.
 */
export default class GestorMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()
    const gestor = await new BuscarGestorDoUsuario().handle({ userId: user.id })

    // Gestão só faz sentido para quem coordena ao menos um curso.
    if (!gestor || gestor.cursos.length === 0) {
      ctx.session.flash('error', 'Área restrita à coordenação de curso.')
      const isEgresso = ctx.session.get(IS_EGRESSO_KEY, false)
      return ctx.response.redirect().toRoute(isEgresso ? 'dashboard' : 'home')
    }

    const cursos = gestor.cursos
    const salvo = ctx.session.get(CURSO_GESTAO_ATIVO_KEY, null)
    const cursoAtivo = cursos.find((curso) => curso.id === salvo) ?? cursos[0] ?? null
    if (cursoAtivo && cursoAtivo.id !== salvo) {
      ctx.session.put(CURSO_GESTAO_ATIVO_KEY, cursoAtivo.id)
    }

    ctx.gestao = { gestor, cursoAtivo }
    ctx.inertia.share({
      gestao: {
        cursoAtivoId: cursoAtivo?.id ?? null,
        cursos: cursos.map((curso) => ({
          id: curso.id,
          nome: curso.nome,
          codigo: curso.codigo,
          nivel: NIVEL_LABELS[curso.nivel],
          campus: CAMPUS_LABELS[curso.campus],
        })),
      },
    })

    return next()
  }
}
