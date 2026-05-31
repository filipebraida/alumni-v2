import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { loadPerfilFlags } from '#services/perfil_flags'

/**
 * Porta da área administrativa. Exige `user.role === 'admin'`. Quem não é
 * admin volta para a sua própria área: egresso → dashboard, gestor → gestão,
 * sem perfil → home. Roda depois do `auth` (e do `gestor` no caso das rotas
 * `/admin/*`, então as flags do user já estarão carregadas — mas chamamos
 * `loadPerfilFlags` por garantia).
 */
export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()

    if (!user.isAdmin) {
      await loadPerfilFlags(user)
      ctx.session.flash('error', 'Área restrita à administração.')
      const destino = user.isEgresso ? 'dashboard' : user.isGestor ? 'gestao.show' : 'home'
      return ctx.response.redirect().toRoute(destino)
    }

    return next()
  }
}
