import { BaseTransformer } from '@adonisjs/core/transformers'

export type Frescor = {
  geral: number
  expiraEm: string
  ultimaRevisao: string
}

export default class FrescorTransformer extends BaseTransformer<Frescor> {
  toObject() {
    return this.pick(this.resource, ['geral', 'expiraEm', 'ultimaRevisao'])
  }
}
