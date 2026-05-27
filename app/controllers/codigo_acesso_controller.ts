import type { HttpContext } from '@adonisjs/core/http'
import SolicitarCodigoAcesso from '#actions/solicitar_codigo_acesso'
import { solicitarCodigoValidator } from '#validators/auth'
import { PENDING_EMAIL_KEY } from '#controllers/session_controller'

export default class CodigoAcessoController {
  /**
   * Envia (ou reenvia) um código de acesso para o e-mail informado e leva o
   * fluxo para o passo do código. Sempre reporta sucesso para não revelar se o
   * e-mail está cadastrado.
   */
  async store({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(solicitarCodigoValidator)

    await new SolicitarCodigoAcesso().handle({
      email,
      ip: request.ip(),
      userAgent: request.header('user-agent'),
    })

    session.put(PENDING_EMAIL_KEY, email)
    session.flash('success', `Enviamos um código para ${email}.`)
    return response.redirect().toRoute('session.create')
  }

  /**
   * Abandona o desafio atual para o usuário informar outro e-mail.
   */
  async destroy({ response, session }: HttpContext) {
    session.forget(PENDING_EMAIL_KEY)
    return response.redirect().toRoute('session.create')
  }
}
