import { DateTime } from 'luxon'

import CodigoAcesso from '#models/codigo_acesso'
import type User from '#models/user'
import BuscarUltimoCodigoAcesso from '#queries/buscar_ultimo_codigo_acesso'
import BuscarUsuarioPorEmail from '#queries/buscar_usuario_por_email'

export type VerificarCodigoAcessoFalha =
  | 'invalid_code'
  | 'expired'
  | 'attempts_exceeded'
  | 'not_found'

export type VerificarCodigoAcessoResult =
  | { ok: true; user: User }
  | { ok: false; reason: VerificarCodigoAcessoFalha }

export interface VerificarCodigoAcessoInput {
  email: string
  code: string
}

/**
 * Verifica o código enviado contra o último código pendente do e-mail.
 * Incrementa o contador de tentativas em caso de erro e consome o código no
 * sucesso.
 */
export default class VerificarCodigoAcesso {
  async handle(input: VerificarCodigoAcessoInput): Promise<VerificarCodigoAcessoResult> {
    const codigo = await new BuscarUltimoCodigoAcesso().handle({ email: input.email })

    if (!codigo) {
      return { ok: false, reason: 'not_found' }
    }

    if (codigo.attempts >= CodigoAcesso.MAX_ATTEMPTS) {
      return { ok: false, reason: 'attempts_exceeded' }
    }

    if (codigo.expiresAt < DateTime.now()) {
      return { ok: false, reason: 'expired' }
    }

    if (CodigoAcesso.hashCode(input.code) !== codigo.codeHash) {
      await CodigoAcesso.query().where('id', codigo.id).increment('attempts', 1)

      const attempts = codigo.attempts + 1
      return {
        ok: false,
        reason: attempts >= CodigoAcesso.MAX_ATTEMPTS ? 'attempts_exceeded' : 'invalid_code',
      }
    }

    // Consome de forma atômica para um envio duplicado não reutilizar o código.
    const consumed = await CodigoAcesso.query()
      .where('id', codigo.id)
      .whereNull('used_at')
      .update({ usedAt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') })

    const didConsume = Number(Array.isArray(consumed) ? consumed[0] : consumed) > 0
    if (!didConsume) {
      return { ok: false, reason: 'invalid_code' }
    }

    const user = await new BuscarUsuarioPorEmail().handle({ email: codigo.email })
    if (!user) {
      return { ok: false, reason: 'not_found' }
    }

    return { ok: true, user }
  }
}
