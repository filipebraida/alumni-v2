/**
 * Formato dos dados do painel do egresso. Hoje alimentado por dados fictícios
 * em `DashboardController`; quando houver persistência, um transformer deve
 * produzir exatamente este formato. Usamos `type` (não `interface`) para que as
 * props aninhadas resolvam corretamente nas páginas Inertia.
 */

export type Egresso = {
  nome: string
  primeiroNome: string
  iniciais: string
  curso: string
  turma: string
  campus: string
  saudacao: string
  agora: string
  verificada: boolean
}

export type Frescor = {
  geral: number
  expiraEm: string
  ultimaRevisao: string
}

export type CampoMec = {
  chave: string
  icone: string
  rotulo: string
  /** `null` = não informado nesta foto (coluna nula na última `resposta`). */
  valor: string | null
}

export type EstadoTurma = {
  uf: string
  nome: string
  total: number
  x: number
  y: number
}

export type MapaTurma = {
  mapeados: number
  turmaTotal: number
  curso: string
  ano: string
  estados: EstadoTurma[]
}

export type Colega = {
  nome: string
  iniciais: string
  cargo: string
  cidade: string
  status: 'ativo' | 'pendente'
}

export type Colegas = {
  total: number
  lista: Colega[]
}

export type FaixaSalarial = {
  rotulo: string
  pct: number
  destaque?: boolean
}

export type FaixaTempo = {
  rotulo: string
  pct: number
}

export type TempoEmprego = {
  mediana: string
  distribuicao: FaixaTempo[]
}

export type Carreira = {
  medianaSalarial: string
  suaFaixa: string
  faixas: FaixaSalarial[]
  tempoEmprego: TempoEmprego
}

export type Experiencia = {
  id: string
  sigla: string
  cargo: string
  org: string
  inicio: string
  fim: string
}

export type DashboardData = {
  egresso: Egresso
  frescor: Frescor
  camposMec: CampoMec[]
  mapaTurma: MapaTurma
  colegas: Colegas
  carreira: Carreira
  experiencias: Experiencia[]
}
