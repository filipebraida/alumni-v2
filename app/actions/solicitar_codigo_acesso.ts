import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'

import CodigoAcesso from '#models/codigo_acesso'
import EmailCodigoAcesso from '#mails/email_codigo_acesso'
import BuscarUsuarioPorEmail from '#queries/buscar_usuario_por_email'

export interface SolicitarCodigoAcessoInput {
  email: string
  ip?: string
  userAgent?: string | null
}

export interface SolicitarCodigoAcessoResult {
  sent: boolean
}

/**
 * Gera um código novo para um e-mail cadastrado, invalida o anterior e envia
 * por e-mail. Para não revelar quais e-mails têm conta, não faz nada (mas
 * devolve uma saída em formato de sucesso) para e-mails desconhecidos.
 */
export default class SolicitarCodigoAcesso {
  async handle(input: SolicitarCodigoAcessoInput): Promise<SolicitarCodigoAcessoResult> {
    const user = await new BuscarUsuarioPorEmail().handle({ email: input.email })
    if (!user) {
      return { sent: false }
    }

    const code = CodigoAcesso.generateCode()
    const codeHash = CodigoAcesso.hashCode(code)
    const expiresAt = DateTime.now().plus({ minutes: CodigoAcesso.TTL_MINUTES })

    await db.transaction(async (trx) => {
      // Atualizações via query builder não serializam colunas, então passamos
      // um valor que o driver consegue bindar no formato datetime do sqlite.
      await CodigoAcesso.query({ client: trx })
        .where('email', input.email)
        .whereNull('used_at')
        .update({ usedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') })

      await CodigoAcesso.create(
        {
          email: input.email,
          codeHash,
          expiresAt,
          ipAddress: input.ip ?? null,
          userAgent: input.userAgent ?? null,
        },
        { client: trx }
      )
    })

    await mail.send(new EmailCodigoAcesso(input.email, code, user.fullName))

    return { sent: true }
  }
}
