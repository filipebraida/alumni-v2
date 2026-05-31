import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  usuario: 'Usuário',
}

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'fullName',
      'email',
      'createdAt',
      'updatedAt',
      'initials',
    ])
  }

  forPerfil() {
    const u = this.resource
    return {
      fullName: u.fullName ?? '',
      iniciais: u.initials,
      emailLogin: u.email,
      role: u.role,
      roleLabel: ROLE_LABEL[u.role] ?? u.role,
      nomeSocial: u.nomeSocial,
      headline: u.headline,
      bio: u.bio,
      fotoUrl: u.fotoUrl,
      telefone: u.telefone,
      cidade: u.cidade,
      uf: u.uf,
      pais: u.pais,
      lattes: u.lattes,
      orcid: u.orcid,
      scholar: u.scholar,
      linkedin: u.linkedin,
      github: u.github,
      site: u.site,
      visEmail: u.visEmail,
      visMapa: u.visMapa,
      visEncontrar: u.visEncontrar,
    }
  }
}
