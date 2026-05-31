import type { HttpContext } from '@adonisjs/core/http'

import BuscarPerfil, { type PerfilDetalhe } from '#queries/buscar_perfil'
import AtualizarPerfil from '#actions/atualizar_perfil'
import { atualizarPerfilValidator } from '#validators/perfil'
import { NIVEL_LABELS } from '#enums/nivel_academico'
import type User from '#models/user'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  usuario: 'Usuário',
}

function iniciais(nome: string) {
  const [primeiro, segundo] = nome.trim().split(/\s+/)
  return `${primeiro?.[0] ?? ''}${segundo?.[0] ?? ''}`.toUpperCase()
}

function nomeExibido(user: User) {
  return user.fullName?.trim() || user.email
}

function viewPayload(detalhe: PerfilDetalhe) {
  const { user, egresso, matriculas, gestor, cursosCoordenados } = detalhe
  const nome = nomeExibido(user)

  return {
    perfil: {
      // Identidade visível (sempre presente, role-agnostic).
      fullName: user.fullName ?? '',
      iniciais: iniciais(nome),
      emailLogin: user.email,
      role: user.role,
      roleLabel: ROLE_LABEL[user.role] ?? user.role,
      nomeSocial: user.nomeSocial,
      headline: user.headline,
      bio: user.bio,
      fotoUrl: user.fotoUrl,
      telefone: user.telefone,
      cidade: user.cidade,
      uf: user.uf,
      pais: user.pais,
      lattes: user.lattes,
      orcid: user.orcid,
      scholar: user.scholar,
      linkedin: user.linkedin,
      github: user.github,
      site: user.site,
      visEmail: user.visEmail,
      visMapa: user.visMapa,
      visEncontrar: user.visEncontrar,
    },
    // Bloco opcional pra quem é egresso (identidade acadêmica + vínculos).
    egresso: egresso
      ? {
          cpf: egresso.cpf,
          nomeAcademico: egresso.nomeCompleto,
          emailPessoal: egresso.emailPessoal,
          vinculos: matriculas.map((m) => ({
            id: m.id,
            nivel: NIVEL_LABELS[m.curso.nivel],
            curso: m.curso.nome,
            instituto: m.curso.instituto.nome,
            codigo: m.codigo,
            periodoFormatura: m.periodoFormatura,
            situacao: m.situacao,
          })),
        }
      : null,
    // Bloco opcional pra quem é coordenador (cargo + cursos coordenados).
    gestor: gestor
      ? {
          cargo: gestor.cargo,
          cursos: cursosCoordenados.map((c) => ({
            id: c.id,
            nome: c.nome,
            codigo: c.codigo,
            nivel: NIVEL_LABELS[c.nivel],
            instituto: c.instituto.nome,
          })),
        }
      : null,
  }
}

/**
 * Perfil self-service — visível a qualquer usuário autenticado, com seções
 * extras pra quem também é egresso e/ou coordenador. Separado do
 * `EgressosController` (que é a visão da gestão sobre os egressos).
 */
export default class PerfilController {
  async show({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const perfil = await new BuscarPerfil().handle(user.id)
    if (!perfil) return response.notFound()
    return inertia.render('perfil/show', viewPayload(perfil))
  }

  async edit({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const perfil = await new BuscarPerfil().handle(user.id)
    if (!perfil) return response.notFound()
    return inertia.render('perfil/edit', viewPayload(perfil))
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
