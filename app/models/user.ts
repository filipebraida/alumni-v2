import { UserSchema } from '#database/schema'
import { hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import Egresso from '#models/egresso'

export default class User extends UserSchema {
  @hasOne(() => Egresso)
  declare egresso: HasOne<typeof Egresso>

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
