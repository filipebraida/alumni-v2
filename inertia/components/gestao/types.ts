/** Curso enxuto exposto ao frontend pelo `gestor` middleware (CursoTransformer). */
export type CursoResumo = {
  id: number
  nome: string
  codigo: string
  nivel: string
  instituto: string
}

/** Shared prop `gestao`: cursos visíveis ao usuário + qual está ativo (tenant). */
export type GestaoShared = {
  cursoAtivoId: number | null
  cursos: CursoResumo[]
  /** Admin enxerga TODOS os cursos da UFRRJ, não só os da pivot do gestor. */
  isAdmin: boolean
}

/** Métricas de frescor do roster do curso (ResumoEgressosDoCurso). */
export type EgressosEstatisticas = {
  total: number
  emDia: number
  desatualizado: number
  semRegistro: number
  pctEmDia: number
  janelaFrescorMeses: number
}
