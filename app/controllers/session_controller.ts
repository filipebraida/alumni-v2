import type { HttpContext } from '@adonisjs/core/http'
import VerificarCodigoAcesso, {
  type VerificarCodigoAcessoFalha,
} from '#actions/verificar_codigo_acesso'
import { verificarCodigoValidator } from '#validators/auth'
import BuscarEgressoDoUsuario from '#queries/buscar_egresso_do_usuario'
import BuscarGestorDoUsuario from '#queries/buscar_gestor_do_usuario'

/** Session key holding the email awaiting code verification. */
export const PENDING_EMAIL_KEY = 'pendingLoginEmail'

/** Flags de perfil gravadas no login; lidas pelo inertia_middleware (prop `perfil`). */
export const IS_EGRESSO_KEY = 'isEgresso'
export const IS_GESTOR_KEY = 'isGestor'
export const IS_ADMIN_KEY = 'isAdmin'

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

    // Perfis do usuário (pode ser os dois). Guardados na sessão para o shared
    // prop `perfil` (menus) e os middlewares de área, sem reconsultar o banco a
    // cada request. Cada área exige um vínculo real: o egresso precisa de ao
    // menos uma matrícula; o gestor, de ao menos um curso sob coordenação.
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: result.user.id })
    const gestor = await new BuscarGestorDoUsuario().handle({ userId: result.user.id })
    const podeEgresso = !!egresso && egresso.matriculas.length > 0
    const podeGestor = !!gestor && gestor.cursos.length > 0
    const ehAdmin = result.user.isAdmin
    session.put(IS_EGRESSO_KEY, podeEgresso)
    session.put(IS_GESTOR_KEY, podeGestor)
    session.put(IS_ADMIN_KEY, ehAdmin)

    // Egresso (mesmo que também seja gestor) entra na área do egresso; só-gestor
    // vai direto para a gestão. A troca entre áreas fica no menu do usuário.
    if (podeEgresso) {
      if (egresso && !egresso.consentimentoEm) {
        return response.redirect().toRoute('onboarding.show')
      }
      return response.redirect().toRoute('dashboard')
    }
    if (podeGestor || ehAdmin) {
      // Admin entra como super-gestor (vê todos os cursos via gestor_middleware).
      return response.redirect().toRoute('gestao.show')
    }

    // Sem vínculo em nenhuma área — não há painel a mostrar.
    session.flash('error', 'Sua conta ainda não tem vínculo de egresso nem de gestão.')
    return response.redirect().toRoute('home')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }
}
