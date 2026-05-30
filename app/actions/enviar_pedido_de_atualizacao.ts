import facteur from '@facteurjs/adonisjs/services/main'
import router from '@adonisjs/core/services/router'
import env from '#start/env'

import Egresso from '#models/egresso'

import PedidoAtualizacaoNotification from '#notifications/pedido_atualizacao_notification'

export interface EnviarPedidoDeAtualizacaoInput {
  egressoIds: number[]
  cursoId: number
  nomeCurso: string
  nomeGestor: string
  mensagem?: string | null
}

export interface EnviarPedidoDeAtualizacaoResult {
  totalSolicitado: number
  enviados: number
  semUsuario: number
}

/**
 * Dispara `PedidoAtualizacaoNotification` para cada egresso selecionado que
 * tenha User (precisa ter logado uma vez para receber). Conta egressos sem
 * usuario para o flash da coordenacao. O link no e-mail vai sempre para o
 * mesmo destino: o fluxo "Atualizar dados" (`respostas.create`).
 */
export default class EnviarPedidoDeAtualizacao {
  async handle(input: EnviarPedidoDeAtualizacaoInput): Promise<EnviarPedidoDeAtualizacaoResult> {
    const { egressoIds, nomeCurso, nomeGestor, mensagem } = input

    if (egressoIds.length === 0) {
      return { totalSolicitado: 0, enviados: 0, semUsuario: 0 }
    }

    // So manda para egressos do curso pedido (o controller ja escopa por
    // `cursoId` via `whereHas('matriculas')`); aqui carregamos o User para
    // resolver o e-mail e o `notifiableId`.
    const egressos = await Egresso.query()
      .whereIn('id', egressoIds)
      .whereHas('matriculas', (matriculas) => matriculas.where('cursoId', input.cursoId))
      .preload('user')

    const base = env.get('APP_URL').replace(/\/$/, '')
    const link = `${base}${router.builder().make('respostas.create')}`

    let enviados = 0
    let semUsuario = 0

    for (const egresso of egressos) {
      if (!egresso.user) {
        semUsuario++
        continue
      }

      await facteur
        .notification(PedidoAtualizacaoNotification)
        .params({
          nomeEgresso: egresso.nomeCompleto,
          nomeCurso,
          nomeGestor,
          link,
          mensagem: mensagem ?? null,
        })
        .to([egresso.user])
        .send()

      enviados++
    }

    return {
      totalSolicitado: egressoIds.length,
      enviados,
      semUsuario: semUsuario + (egressoIds.length - egressos.length),
    }
  }
}
