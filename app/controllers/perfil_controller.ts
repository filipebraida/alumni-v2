import type { HttpContext } from '@adonisjs/core/http'

import BuscarPerfil from '#queries/buscar_perfil'
import AtualizarPerfil from '#actions/atualizar_perfil'
import { atualizarPerfilValidator } from '#validators/perfil'
import EgressoTransformer from '#transformers/egresso_transformer'
import GestorTransformer from '#transformers/gestor_transformer'
import UserTransformer from '#transformers/user_transformer'

/**
 * Perfil self-service — visível a qualquer usuário autenticado, com seções
 * extras pra quem também é egresso e/ou coordenador. Separado do
 * `EgressosController` (que é a visão da gestão sobre os egressos).
 */
export default class PerfilController {
  async show({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const detalhe = await new BuscarPerfil().handle(user.id)
    if (!detalhe) return response.notFound()

    return inertia.render('perfil/show', {
      usuario: UserTransformer.transform(detalhe.user).useVariant('forPerfil'),
      egresso: detalhe.egresso
        ? EgressoTransformer.transform(detalhe.egresso).useVariant('forPerfil')
        : null,
      gestor: detalhe.gestor
        ? GestorTransformer.transform(detalhe.gestor).useVariant('forPerfil')
        : null,
    })
  }

  async edit({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const detalhe = await new BuscarPerfil().handle(user.id)
    if (!detalhe) return response.notFound()

    return inertia.render('perfil/edit', {
      usuario: UserTransformer.transform(detalhe.user).useVariant('forPerfil'),
      egresso: detalhe.egresso
        ? EgressoTransformer.transform(detalhe.egresso).useVariant('forPerfil')
        : null,
      gestor: detalhe.gestor
        ? GestorTransformer.transform(detalhe.gestor).useVariant('forPerfil')
        : null,
    })
  }

  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(atualizarPerfilValidator)

    const result = await new AtualizarPerfil().handle({
      userId: user.id,
      fullName: data.fullName,
      nomeSocial: data.nomeSocial ?? null,
      headline: data.headline ?? null,
      bio: data.bio ?? null,
      telefone: data.telefone ?? null,
      cidade: data.cidade ?? null,
      uf: data.uf ?? null,
      pais: data.pais ?? null,
      lattes: data.lattes ?? null,
      orcid: data.orcid ?? null,
      scholar: data.scholar ?? null,
      linkedin: data.linkedin ?? null,
      github: data.github ?? null,
      site: data.site ?? null,
      visEmail: data.visEmail,
      visMapa: data.visMapa,
      visEncontrar: data.visEncontrar,
    })

    if (result.status === 'nao_encontrado') return response.notFound()

    session.flash('success', 'Perfil atualizado.')
    return response.redirect().toRoute('perfil.show')
  }
}
