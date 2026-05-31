import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { loadPerfilFlags } from '#services/perfil_flags'

/**
 * Porta da área do egresso (síntese, onboarding, respostas). Exige o perfil de
 * egresso (vínculo real: ao menos uma matrícula). Quem não tem cai na sua
 * própria área: a gestão, se for gestor; senão, o portal. Roda depois do
 * `auth`.
 */
export default class EgressoMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()
    await loadPerfilFlags(user)

    if (!user.isEgresso) {
      ctx.session.flash('error', 'Área restrita aos egressos.')
      return ctx.response.redirect().toRoute(user.isGestor ? 'gestao.show' : 'home')
    }

    return next()
  }
}
