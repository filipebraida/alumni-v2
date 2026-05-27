import { BaseMail } from '@adonisjs/mail'
import CodigoAcesso from '#models/codigo_acesso'

/**
 * E-mail que carrega o código de acesso de uso único. O remetente vem do `from`
 * global configurado em config/mail.ts.
 */
export default class EmailCodigoAcesso extends BaseMail {
  subject = 'Seu código de acesso — SAE UFRRJ'

  constructor(
    private email: string,
    private code: string,
    private fullName: string | null = null
  ) {
    super()
  }

  prepare() {
    this.message.to(this.email).subject(this.subject)
    this.message.htmlView('emails/codigo_acesso', {
      code: this.code,
      fullName: this.fullName,
      ttlMinutes: CodigoAcesso.TTL_MINUTES,
    })
  }
}
