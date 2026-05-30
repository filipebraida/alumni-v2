import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { IS_ADMIN_KEY, IS_EGRESSO_KEY, IS_GESTOR_KEY } from '#controllers/session_controller'

/**
 * Porta da área administrativa. Exige o flag `isAdmin` (gravado na sessão no
 * login a partir de `user.role === 'admin'`). Quem não é admin volta para a
 * sua própria área: egresso → dashboard, gestor → gestão, sem perfil → home.
 * Roda depois do `auth`.
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.session.get(IS_ADMIN_KEY, false)) {
      ctx.session.flash('error', 'Área restrita à administração.')
      const isEgresso = ctx.session.get(IS_EGRESSO_KEY, false)
      const isGestor = ctx.session.get(IS_GESTOR_KEY, false)
      const destino = isEgresso ? 'dashboard' : isGestor ? 'gestao.show' : 'home'
      return ctx.response.redirect().toRoute(destino)
    }

    return next()
  }
}
