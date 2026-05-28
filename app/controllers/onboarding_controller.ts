import type { HttpContext } from '@adonisjs/core/http'
import type Matricula from '#models/matricula'
import BuscarEgressoDoUsuario from '#queries/buscar_egresso_do_usuario'
import ConfirmarIdentidade from '#actions/confirmar_identidade'
import { CAMPUS_LABELS } from '#enums/campus'
import { NIVEL_LABELS } from '#enums/nivel_academico'

function iniciais(nome: string) {
  const [primeiro, segundo] = nome.trim().split(/\s+/)
  return `${primeiro?.[0] ?? ''}${segundo?.[0] ?? ''}`.toUpperCase()
}

/** O vínculo mais relevante para a identidade: a graduação, ou o primeiro. */
function vinculoPrincipal(matriculas: Matricula[]) {
  return matriculas.find((m) => m.curso.nivel === 'graduacao') ?? matriculas[0] ?? null
}

export default class OnboardingController {
  /** Tela "É você?" — identidade pré-populada (SIGAA) do egresso logado. */
  async show({ auth, inertia, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: user.id })
    if (!egresso) return response.redirect().toRoute('dashboard')

    const vinculo = vinculoPrincipal(egresso.matriculas)
    return inertia.render('onboarding', {
      identidade: {
        nome: egresso.nomeCompleto,
        iniciais: iniciais(egresso.nomeCompleto),
        email: user.email,
        matricula: vinculo?.codigo ?? null,
        curso: vinculo?.curso.nome ?? null,
        nivel: vinculo ? NIVEL_LABELS[vinculo.curso.nivel] : null,
        campus: vinculo ? CAMPUS_LABELS[vinculo.curso.campus] : null,
        turma: vinculo?.periodoFormatura ?? null,
        colacao: vinculo?.dataColacao ? vinculo.dataColacao.toFormat('MM/yyyy') : null,
        outrosVinculos: Math.max(egresso.matriculas.length - 1, 0),
      },
    })
  }

  /** "Sou eu — atualizar meus dados": confirma identidade + consentimento. */
  async update({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: user.id })
    if (egresso) await new ConfirmarIdentidade().handle(egresso)
    // TODO: redirecionar para a tela "Confirmar dados" quando ela existir.
    return response.redirect().toRoute('dashboard')
  }
}
