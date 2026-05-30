import { DatabaseMessage } from '@facteurjs/adonisjs/channels/database'
import { TransmitMessage } from '@facteurjs/adonisjs/channels/transmit'
import { Notification } from '@facteurjs/adonisjs/types'

import EmailPedidoAtualizacao from '#mails/email_pedido_atualizacao'

import type User from '#models/user'

export type PedidoAtualizacaoParams = {
  nomeEgresso: string
  nomeCurso: string
  nomeGestor: string
  link: string
  mensagem?: string | null
}

/**
 * Avisa o egresso que a coordenacao do curso pediu uma atualizacao do
 * questionario. Tres canais: `database` (sino no header), `transmit` (badge em
 * tempo real) e `mail` (com link para `/respostas/create`).
 *
 * O facteur descobre essa classe automaticamente via discoverer
 * (`./app/**\/*_notification.ts`).
 */
export default class PedidoAtualizacaoNotification extends Notification<
  User,
  PedidoAtualizacaoParams
> {
  static options = {
    name: 'pedido-atualizacao',
    deliverBy: { database: true, transmit: true, mail: true },
  }

  asDatabaseMessage() {
    const { nomeCurso, nomeGestor, link } = this.params
    return DatabaseMessage.create()
      .setType('pedido-atualizacao')
      .setContent({
        title: `Atualize seu questionário em ${nomeCurso}`,
        body: `${nomeGestor} pediu que você revise seus dados.`,
        link,
      })
      .setStatus('unseen')
      .setTags(['pedido-atualizacao'])
  }

  asTransmitMessage() {
    return TransmitMessage.create().setContent({ kind: 'pedido-atualizacao' })
  }

  asMailMessage() {
    const { nomeEgresso, nomeCurso, nomeGestor, link, mensagem } = this.params
    return new EmailPedidoAtualizacao(nomeEgresso, nomeCurso, nomeGestor, link, mensagem ?? null)
  }
}
