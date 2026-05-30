import type { HttpContext } from '@adonisjs/core/http'

import BuscarPerfil, { type PerfilDetalhe } from '#queries/buscar_perfil'
import AtualizarPerfil from '#actions/atualizar_perfil'
import { atualizarPerfilValidator } from '#validators/perfil'
import { NIVEL_LABELS } from '#enums/nivel_academico'

function iniciais(nome: string) {
  const [primeiro, segundo] = nome.trim().split(/\s+/)
  return `${primeiro?.[0] ?? ''}${segundo?.[0] ?? ''}`.toUpperCase()
}

function viewPayload(perfil: PerfilDetalhe, emailLogin: string) {
  const e = perfil.egresso
  return {
    perfil: {
      nomeCompleto: e.nomeCompleto,
      iniciais: iniciais(e.nomeCompleto),
      cpf: e.cpf,
      emailLogin,
      emailPessoal: e.emailPessoal,
      nomeSocial: e.nomeSocial,
      headline: e.headline,
      bio: e.bio,
      fotoUrl: e.fotoUrl,
      telefone: e.telefone,
      cidade: e.cidade,
      uf: e.uf,
      pais: e.pais,
      lattes: e.lattes,
      orcid: e.orcid,
      scholar: e.scholar,
      linkedin: e.linkedin,
      github: e.github,
      site: e.site,
      visEmail: e.visEmail,
      visMapa: e.visMapa,
      visEncontrar: e.visEncontrar,
    },
    vinculos: perfil.matriculas.map((matricula) => ({
      id: matricula.id,
      nivel: NIVEL_LABELS[matricula.curso.nivel],
      curso: matricula.curso.nome,
      instituto: matricula.curso.instituto.nome,
      codigo: matricula.codigo,
      periodoFormatura: matricula.periodoFormatura,
      situacao: matricula.situacao,
    })),
  }
}

/**
 * Perfil self-service do egresso. Separado do `EgressosController` (gestão)
 * porque é a mesma linha vista por outro ator — o próprio dono. `show` é a
 * tela enxuta de aterrissagem; `edit` é o formulário do design; `update`
 * persiste as alterações via `AtualizarPerfil`.
 */
export default class PerfilController {
  async show({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const perfil = await new BuscarPerfil().handle(user.id)
    if (!perfil) return response.redirect().toRoute('onboarding.show')
    return inertia.render('perfil/show', viewPayload(perfil, user.email))
  }

  async edit({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const perfil = await new BuscarPerfil().handle(user.id)
    if (!perfil) return response.redirect().toRoute('onboarding.show')
    return inertia.render('perfil/edit', viewPayload(perfil, user.email))
  }

  async update({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(atualizarPerfilValidator)

    const result = await new AtualizarPerfil().handle({
      userId: user.id,
      nomeCompleto: data.nomeCompleto,
      nomeSocial: data.nomeSocial ?? null,
      headline: data.headline ?? null,
      bio: data.bio ?? null,
      emailPessoal: data.emailPessoal ?? null,
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

    if (result.status === 'sem_egresso') {
      return response.redirect().toRoute('onboarding.show')
    }

    session.flash('success', 'Perfil atualizado.')
    return response.redirect().toRoute('perfil.show')
  }
}
