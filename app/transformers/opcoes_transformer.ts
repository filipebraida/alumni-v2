import { BaseTransformer } from '@adonisjs/core/transformers'

export type Opcao = { valor: string; rotulo: string }

export type OpcoesEnums = {
  setor: Opcao[]
  faixaSalarial: Opcao[]
  relacaoFormacao: Opcao[]
  tempoPrimeiroEmprego: Opcao[]
}

export default class OpcoesTransformer extends BaseTransformer<OpcoesEnums> {
  toObject() {
    return this.pick(this.resource, [
      'setor',
      'faixaSalarial',
      'relacaoFormacao',
      'tempoPrimeiroEmprego',
    ])
  }
}
