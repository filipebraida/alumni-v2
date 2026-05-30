import Instituto from '#models/instituto'

export interface CriarInstitutoInput {
  codigo: string
  nome: string
}

export type CriarInstitutoResult =
  | { status: 'criado'; instituto: { id: number; nome: string } }
  | { status: 'codigo_em_uso' }

/** `codigo` é chave natural (curto, único). */
export default class CriarInstituto {
  async handle({ codigo, nome }: CriarInstitutoInput): Promise<CriarInstitutoResult> {
    const emUso = await Instituto.findBy('codigo', codigo)
    if (emUso) return { status: 'codigo_em_uso' as const }

    const instituto = await Instituto.create({ codigo, nome, ativo: true })
    return { status: 'criado' as const, instituto: { id: instituto.id, nome: instituto.nome } }
  }
}
