import { BaseTransformer } from '@adonisjs/core/transformers'

export type SnapshotPainel = {
  hoje: string
  ultimaFoto: string
}

export default class SnapshotPainelTransformer extends BaseTransformer<SnapshotPainel> {
  toObject() {
    return this.pick(this.resource, ['hoje', 'ultimaFoto'])
  }
}
