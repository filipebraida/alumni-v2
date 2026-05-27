import User from '#models/user'

export interface BuscarUsuarioPorEmailInput {
  email: string
}

/** Busca um usuário pelo e-mail. Retorna null quando não há conta. */
export default class BuscarUsuarioPorEmail {
  async handle({ email }: BuscarUsuarioPorEmailInput): Promise<User | null> {
    return User.findBy('email', email)
  }
}
