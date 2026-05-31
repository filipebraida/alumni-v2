import RespostaCurso from '#models/resposta_curso'

export interface BuscarUltimasRespostasCursoDasMatriculasInput {
  matriculaIds: number[]
}

/**
 * Para cada matrícula, devolve a última `RespostaCurso` (foto mais recente
 * dos campos próprios daquela formação), indexada por `matricula_id`.
 * Usada pelo painel para hidratar os 3 cartões MEC de graduação. Matrículas
 * sem resposta ficam ausentes do Map — o caller resolve pra `null`.
 */
export default class BuscarUltimasRespostasCursoDasMatriculas {
  async handle({
    matriculaIds,
  }: BuscarUltimasRespostasCursoDasMatriculasInput): Promise<Map<number, RespostaCurso>> {
    if (matriculaIds.length === 0) return new Map()

    const todas = await RespostaCurso.query()
      .whereIn('matricula_id', matriculaIds)
      .orderBy('ano', 'desc')

    const ultima = new Map<number, RespostaCurso>()
    for (const r of todas) {
      if (!ultima.has(r.matriculaId)) ultima.set(r.matriculaId, r)
    }
    return ultima
  }
}
