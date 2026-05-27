import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // A known alumnus to exercise the passwordless login flow in development.
    await User.updateOrCreate(
      { email: 'egresso@example.com' },
      { email: 'egresso@example.com', fullName: 'Egresso de Teste' }
    )
  }
}
