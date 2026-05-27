import type { HttpContext } from '@adonisjs/core/http'
import VerificarCodigoAcesso, {
  type VerificarCodigoAcessoFalha,
} from '#actions/verificar_codigo_acesso'
import { verificarCodigoValidator } from '#validators/auth'

/** Session key holding the email awaiting code verification. */
export const PENDING_EMAIL_KEY = 'pendingLoginEmail'

const ERROR_MESSAGES: Record<VerificarCodigoAcessoFalha, string> = {
  invalid_code: 'Código inválido. Confira e tente novamente.',
  expired: 'Este código expirou. Solicite um novo.',
  attempts_exceeded: 'Muitas tentativas. Solicite um novo código.',
  not_found: 'Código inválido. Confira e tente novamente.',
}

export default class SessionController {
  /**
   * Dedicated login page (`GET /login`). It hosts the whole passwordless flow:
   * with no pending email it shows the email step, otherwise the code step.
   */
  async create({ inertia, session }: HttpContext) {
    return inertia.render('auth/login', {
      pendingEmail: session.get(PENDING_EMAIL_KEY, null),
    })
  }

  async store({ request, auth, response, session }: HttpContext) {
    const email = session.get(PENDING_EMAIL_KEY, null)
    if (!email) {
      session.flash('error', 'Sua sessão expirou. Informe seu e-mail novamente.')
      return response.redirect().toRoute('session.create')
    }

    const { code } = await request.validateUsing(verificarCodigoValidator)
    const result = await new VerificarCodigoAcesso().handle({ email, code })

    if (!result.ok) {
      // Codes that can't be retried drop the pending email; the next GET /login
      // then bounces the user back to the home page to request a fresh one.
      if (result.reason === 'expired' || result.reason === 'attempts_exceeded') {
        session.forget(PENDING_EMAIL_KEY)
      }
      session.flash('error', ERROR_MESSAGES[result.reason])
      return response.redirect().toRoute('session.create')
    }

    await auth.use('web').login(result.user)
    session.forget(PENDING_EMAIL_KEY)
    return response.redirect().toRoute('dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
