import { BaseTransformer } from '@adonisjs/core/transformers'

export type EgressosEstatisticasSource = {
  total: number
  emDia: number
  desatualizado: number
  semRegistro: number
  pctEmDia: number
  janelaFrescorMeses: number
}

export default class EgressosEstatisticasTransformer extends BaseTransformer<EgressosEstatisticasSource> {
  toObject() {
    return this.pick(this.resource, [
      'total',
      'emDia',
      'desatualizado',
      'semRegistro',
      'pctEmDia',
      'janelaFrescorMeses',
    ])
  }
}
