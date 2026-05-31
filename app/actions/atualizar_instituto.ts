import Instituto from '#models/instituto'

export interface AtualizarInstitutoInput {
  id: number
  codigo: string
  nome: string
  ativo: boolean
}

export type AtualizarInstitutoResult =
  | { status: 'atualizado'; instituto: { id: number; nome: string } }
  | { status: 'inexistente' }
  | { status: 'codigo_em_uso' }

/** Atualiza nome/código/status. Código continua único — checa colisão antes. */
export default class AtualizarInstituto {
  async handle({
    id,
    codigo,
    nome,
    ativo,
  }: AtualizarInstitutoInput): Promise<AtualizarInstitutoResult> {
    const instituto = await Instituto.find(id)
    if (!instituto) return { status: 'inexistente' as const }

    if (codigo !== instituto.codigo) {
      const colisao = await Instituto.findBy('codigo', codigo)
      if (colisao && colisao.id !== id) return { status: 'codigo_em_uso' as const }
    }

    instituto.merge({ codigo, nome, ativo })
    await instituto.save()
    return { status: 'atualizado' as const, instituto: { id: instituto.id, nome: instituto.nome } }
  }
}
