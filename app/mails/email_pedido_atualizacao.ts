import { BaseMail } from '@adonisjs/mail'

/**
 * E-mail enviado ao egresso quando a coordenação do curso solicita atualização
 * do questionário do SAE. Texto guia ao link de "Atualizar dados" do portal.
 */
export default class EmailPedidoAtualizacao extends BaseMail {
  subject = 'Atualize seu questionário no SAE'

  constructor(
    private nomeEgresso: string,
    private nomeCurso: string,
    private nomeGestor: string,
    private link: string,
    private mensagem: string | null = null
  ) {
    super()
  }

  prepare() {
    this.message.subject(this.subject)
    this.message.htmlView('emails/pedido_atualizacao', {
      nomeEgresso: this.nomeEgresso,
      nomeCurso: this.nomeCurso,
      nomeGestor: this.nomeGestor,
      link: this.link,
      mensagem: this.mensagem,
    })
  }
}
