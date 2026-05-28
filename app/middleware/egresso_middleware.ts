import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { IS_EGRESSO_KEY, IS_GESTOR_KEY } from '#controllers/session_controller'

/**
 * Porta da área do egresso (síntese, onboarding, respostas). Exige o perfil de
 * egresso, gravado na sessão no login a partir do vínculo real (egresso com ao
 * menos uma matrícula). Quem não tem cai na sua própria área: a gestão, se for
 * gestor; senão, o portal. Roda depois do `auth`.
 */
export default class EgressoMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.session.get(IS_EGRESSO_KEY, false)) {
      ctx.session.flash('error', 'Área restrita aos egressos.')
      const isGestor = ctx.session.get(IS_GESTOR_KEY, false)
      return ctx.response.redirect().toRoute(isGestor ? 'gestao.show' : 'home')
    }

    return next()
  }
}
