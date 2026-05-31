import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import ContarNotificacoesNaoVistas from '#queries/contar_notificacoes_nao_vistas'
import { loadPerfilFlags } from '#services/perfil_flags'
import UserTransformer from '#transformers/user_transformer'
import { NIVEL_LABELS } from '#enums/nivel_academico'
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
     * Perfis do usuário, lidos direto do model (`User.isEgresso/isGestor/isAdmin`).
     * `loadPerfilFlags` carrega egresso/matriculas + gestor/cursos uma vez
     * por request — barato pra app interno, evita o cache em sessão stale.
     */
    if (auth?.user) await loadPerfilFlags(auth.user)
    const perfil = {
      isEgresso: auth?.user?.isEgresso ?? false,
      isGestor: auth?.user?.isGestor ?? false,
      isAdmin: auth?.user?.isAdmin ?? false,
    }

    // Badge do sino: contador de nao-vistas por usuario. Avalia so quando ha
    // usuario autenticado; visitante recebe 0.
    const unseenNotificationsCount = auth?.user
      ? await new ContarNotificacoesNaoVistas().handle({ userId: auth.user.id })
      : 0

    // `ctx.gestao` é populado pelo `gestor_middleware` quando o request entra
    // na área de gestão. Projetamos a shape pro frontend; rotas fora da gestão
    // recebem `undefined` (Inertia rejeita `null` no `always`).
    const gestaoCtx = (ctx as Partial<HttpContext>).gestao
    const gestao = gestaoCtx
      ? {
          cursoAtivoId: gestaoCtx.cursoAtivo?.id ?? null,
          isAdmin: gestaoCtx.isAdmin,
          cursos: gestaoCtx.cursos.map((curso) => ({
            id: curso.id,
            nome: curso.nome,
            codigo: curso.codigo,
            nivel: NIVEL_LABELS[curso.nivel],
            instituto: curso.instituto.nome,
          })),
        }
      : undefined

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
      gestao: ctx.inertia.always(gestao),
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
