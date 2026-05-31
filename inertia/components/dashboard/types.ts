/**
 * Formato dos dados do painel do egresso — proposta multi-formação. Um egresso
 * pode ter 1+ vínculo com a UFRRJ (graduação, pós, etc). "Dados gerais" valem
 * pra todas; cada formação carrega sua própria turma, colegas e insights.
 * Hoje servido por mock em `DashboardController`; quando houver persistência,
 * um transformer deve produzir exatamente este formato.
 */

export type Egresso = {
  nome: string
  primeiroNome: string
  iniciais: string
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

export type Snapshot = {
  hoje: string
  ultimaFoto: string
}

export type Confianca = 'confirmado' | 'desatualizado' | 'ausente'

export type CampoMec = {
  chave: string
  icone: string
  rotulo: string
  valor: string
  atualizadoEm: string
  confianca: Confianca
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
  estados: EstadoTurma[]
}

export type Colega = {
  nome: string
  iniciais: string
  cargo: string
  cidade: string
  status: 'ativo' | 'pendente'
}

export type FaixaPct = {
  rotulo: string
  pct: number
  destaque?: boolean
}

export type InsightSalario = {
  tipo: 'salario'
  mediana: string
  suaFaixa: string
  faixas: FaixaPct[]
  ladoTitulo: string
  ladoMediana: string
  ladoDistribuicao: FaixaPct[]
  ladoEgresso: string
}

export type InsightSituacao = {
  tipo: 'situacao'
  resumo: string
  distribuicao: FaixaPct[]
  ladoTitulo: string
  ladoMediana: string
  ladoDistribuicao: FaixaPct[]
  ladoEgresso: string
}

export type Insight = InsightSalario | InsightSituacao

export type StatusFormacao = 'concluido' | 'em_curso'

export type Formacao = {
  id: number
  codigo: string
  nivel: string
  diploma: string
  curto: string
  campus: string
  rotuloTurma: string
  periodo: string
  status: StatusFormacao
  frescor: number
  camposMec: CampoMec[]
  // Agregados de turma (mapa, colegas, insight) ficam fora desta entrega;
  // entram em changes próprias com piso de privacidade pra turmas pequenas.
}

export type DashboardData = {
  egresso: Egresso
  frescor: Frescor
  snapshot: Snapshot
  camposGerais: CampoMec[]
  formacoes: Formacao[]
}
