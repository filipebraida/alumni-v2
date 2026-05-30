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
  return {
    perfil: {
      nomeCompleto: perfil.egresso.nomeCompleto,
      iniciais: iniciais(perfil.egresso.nomeCompleto),
      cpf: perfil.egresso.cpf,
      emailLogin,
      emailPessoal: perfil.egresso.emailPessoal,
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
      emailPessoal: data.emailPessoal ?? null,
    })

    if (result.status === 'sem_egresso') {
      return response.redirect().toRoute('onboarding.show')
    }

    session.flash('success', 'Perfil atualizado.')
    return response.redirect().toRoute('perfil.show')
  }
}
