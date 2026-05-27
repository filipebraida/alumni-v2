import { createHash, randomInt } from 'node:crypto'
import { LoginCodeSchema } from '#database/schema'

/**
 * Código de acesso de uso único enviado por e-mail. Apenas o hash SHA256 é
 * persistido; o código em texto vive somente no e-mail enviado ao usuário.
 */
export default class CodigoAcesso extends LoginCodeSchema {
  /** Modelo de domínio mapeado para a tabela técnica de persistência. */
  static table = 'login_codes'

  static CODE_LENGTH = 6
  static TTL_MINUTES = 10
  static MAX_ATTEMPTS = 5

  /** Gera um código numérico aleatório com zero à esquerda (ex.: "004217"). */
  static generateCode() {
    const max = 10 ** this.CODE_LENGTH
    return randomInt(0, max).toString().padStart(this.CODE_LENGTH, '0')
  }

  /** Hash do código para armazenar/comparar. Nunca persista o código em texto. */
  static hashCode(code: string) {
    return createHash('sha256').update(code).digest('hex')
  }
}
