/** Curso enxuto exposto ao frontend pelo `gestor` middleware (CursoTransformer). */
export type CursoResumo = {
  id: number
  nome: string
  codigo: string
  nivel: string
  campus: string
}

/** Shared prop `gestao`: cursos do gestor + qual está ativo (o "tenant"). */
export type GestaoShared = {
  cursoAtivoId: number | null
  cursos: CursoResumo[]
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
