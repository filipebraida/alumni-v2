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
      iniciaisGestor: iniciais(this.nomeGestor),
      link: this.link,
      mensagem: this.mensagem,
    })
  }
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return 'SAE'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}
