import type User from '#models/user'

/**
 * Preload de egresso/matriculas + gestor/cursos pra que os getters
 * `User.isEgresso` e `User.isGestor` reflitam realidade. Chamado pelos
 * middlewares (`inertia`, `egresso`, `gestor`) e pelo `SessionController`
 * pra decidir pra qual área enviar o user após login.
 *
 * Fica fora do model porque o TypeScript não infere bem `this.load(...)`
 * com generics dentro da classe (`ExtractModelRelations<this>` resolve
 * mal). Como função externa com `user: User` tipado o autocomplete volta.
 */
export async function loadPerfilFlags(user: User) {
  await user.load('egresso', (e) => e.preload('matriculas'))
  await user.load('gestor', (g) => g.preload('cursos'))
}
