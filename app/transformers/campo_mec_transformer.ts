import { BaseTransformer } from '@adonisjs/core/transformers'

export type Confianca = 'confirmado' | 'desatualizado' | 'ausente'

export type CampoMec = {
  chave: string
  icone: string
  rotulo: string
  valor: string
  atualizadoEm: string
  confianca: Confianca
}

export default class CampoMecTransformer extends BaseTransformer<CampoMec> {
  toObject() {
    return this.pick(this.resource, [
      'chave',
      'icone',
      'rotulo',
      'valor',
      'atualizadoEm',
      'confianca',
    ])
  }
}
