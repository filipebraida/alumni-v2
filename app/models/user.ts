import { UserSchema } from '#database/schema'
import { hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'
import Gestor from '#models/gestor'

export default class User extends UserSchema {
  @hasOne(() => Egresso)
  declare egresso: HasOne<typeof Egresso>

  @hasOne(() => Gestor)
  declare gestor: HasOne<typeof Gestor>

  get isAdmin() {
    return this.role === 'admin'
  }

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  /**
   * Alvos por canal do facteur (ver `config/notifications.ts`). Define para onde
   * cada canal entrega: `database`/`transmit` usam o `id` como `notifiableId` (e
   * nome do canal SSE pessoal); `mail` usa o e-mail de login.
   */
  notificationTargets() {
    return {
      database: { notifiableId: String(this.id) },
      transmit: { channel: `notifications/user-${this.id}` },
      mail: { email: this.email },
    }
  }
}
