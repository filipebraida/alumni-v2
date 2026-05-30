import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ContarNotificacoesNaoVistas from '#queries/contar_notificacoes_nao_vistas'
import UserTransformer from '#transformers/user_transformer'
import { IS_ADMIN_KEY, IS_EGRESSO_KEY, IS_GESTOR_KEY } from '#controllers/session_controller'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(ctx: HttpContext) {
    /**
     * The share method is called everytime an Inertia page is rendered. In
     * certain cases, a page may get rendered before the session middleware
     * or the auth middleware are executed. For example: During a 404 request.
     *
     * In that case, we must always assume that HttpContext is not fully hydrated
     * with all the properties
     */
    const { session, auth } = ctx as Partial<HttpContext>

    /**
     * Fetching the first error from the flash messages
     */
    const error = session?.flashMessages.get('error') as string
    const success = session?.flashMessages.get('success') as string

    /**
     * Perfis do usuário, gravados na sessão no login. Alimentam os menus (ex.:
     * link para a gestão no menu do egresso) sem consultar o banco a cada page.
     */
    const perfil = {
      isEgresso: (session?.get(IS_EGRESSO_KEY, false) ?? false) as boolean,
      isGestor: (session?.get(IS_GESTOR_KEY, false) ?? false) as boolean,
      isAdmin: (session?.get(IS_ADMIN_KEY, false) ?? false) as boolean,
    }

    // Badge do sino: contador de nao-vistas por usuario. Avalia so quando ha
    // usuario autenticado; visitante recebe 0.
    const unseenNotificationsCount = auth?.user
      ? await new ContarNotificacoesNaoVistas().handle({ userId: auth.user.id })
      : 0

    /**
     * Data shared with all Inertia pages. Make sure you are using
     * transformers for rich data-types like Models.
     */
    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      flash: ctx.inertia.always({
        error,
        success,
      }),
      user: ctx.inertia.always(auth?.user ? UserTransformer.transform(auth.user) : undefined),
      perfil: ctx.inertia.always(perfil),
      csrf: ctx.inertia.always(ctx.request.csrfToken),
      unseenNotificationsCount: ctx.inertia.always(unseenNotificationsCount),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
