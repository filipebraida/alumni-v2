import type { HttpContext } from '@adonisjs/core/http'

import MarcarNotificacaoLida from '#actions/marcar_notificacao_lida'
import MarcarNotificacoesLidas from '#actions/marcar_notificacoes_lidas'
import MarcarNotificacoesVistas from '#actions/marcar_notificacoes_vistas'

import ListarNotificacoes from '#queries/listar_notificacoes'

/**
 * Endpoints da caixa pessoal de notificacoes consumidos pelo sino do header
 * (fetch + JSON, fora do fluxo Inertia para nao re-renderizar a pagina toda).
 */
export default class NotificacoesController {
  async index({ auth, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const resultado = await new ListarNotificacoes().handle({ userId })

    return response.json(resultado)
  }

  async ler({ auth, params, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    const resultado = await new MarcarNotificacaoLida().handle({
      userId,
      notificacaoId: Number(params.id),
    })

    if (resultado.status === 'nao_encontrada') {
      return response.notFound({ error: 'Notificação não encontrada.' })
    }

    return response.json({ ok: true })
  }

  async visualizar({ auth, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    await new MarcarNotificacoesVistas().handle({ userId })

    return response.json({ ok: true })
  }

  async lerTodas({ auth, response }: HttpContext) {
    const userId = auth.getUserOrFail().id
    await new MarcarNotificacoesLidas().handle({ userId })

    return response.json({ ok: true })
  }
}
