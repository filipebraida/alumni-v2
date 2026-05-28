/**
 * Tipos do fluxo de atualização. O formato dos dados espelha o validator
 * `registrarRespostaValidator` (chaves camelCase); cada campo aceita `null`
 * (não informado). Os valores das opções são os códigos dos enums; o `rotulo`
 * é só apresentação.
 */

export type Status = 'pendente' | 'confirmado' | 'atualizado'

/** Dados enviados ao gravar a foto — 1:1 com `registrarRespostaValidator`. */
export type RegistrarResposta = {
  localizacaoCidade: string | null
  localizacaoUf: string | null
  localizacaoPais: string | null
  empregador: string | null
  cargo: string | null
  setor: string | null
  faixaSalarial: string | null
  relacaoFormacao: string | null
  tempoPrimeiroEmprego: string | null
  posGrau: string | null
  posCurso: string | null
  posInstituicao: string | null
  posStatus: string | null
}

export type Opcao = { valor: string; rotulo: string }

export type Opcoes = {
  setor: Opcao[]
  faixaSalarial: Opcao[]
  relacaoFormacao: Opcao[]
  tempoPrimeiroEmprego: Opcao[]
  posGrau: Opcao[]
  posStatus: Opcao[]
}

export type EditorTipo = 'texto' | 'opcoes' | 'local' | 'pos'

export type CampoConfig = {
  /** Identificador do card (chave de status/edição). */
  id: string
  icone: string
  rotulo: string
  ajuda?: string
  editor: EditorTipo
  /** Chave única no form, para editores 'texto' e 'opcoes'. */
  campo?: keyof RegistrarResposta
  /** Lista de opções (para 'opcoes'). */
  opcoesKey?: keyof Opcoes
}

/** Os 8 cards apresentados ao egresso. */
export const CAMPOS: CampoConfig[] = [
  {
    id: 'localizacao',
    icone: 'pin',
    rotulo: 'Onde você mora',
    editor: 'local',
    ajuda: 'Cidade e estado.',
  },
  {
    id: 'empregador',
    icone: 'briefcase',
    rotulo: 'Empresa ou instituição',
    editor: 'texto',
    campo: 'empregador',
  },
  { id: 'cargo', icone: 'star', rotulo: 'Cargo / função', editor: 'texto', campo: 'cargo' },
  {
    id: 'setor',
    icone: 'flag',
    rotulo: 'Setor de atuação',
    editor: 'opcoes',
    campo: 'setor',
    opcoesKey: 'setor',
  },
  {
    id: 'faixaSalarial',
    icone: 'chart',
    rotulo: 'Faixa salarial',
    editor: 'opcoes',
    campo: 'faixaSalarial',
    opcoesKey: 'faixaSalarial',
    ajuda: 'Usada só em agregado, nunca individual.',
  },
  {
    id: 'relacaoFormacao',
    icone: 'check',
    rotulo: 'Trabalho na sua área?',
    editor: 'opcoes',
    campo: 'relacaoFormacao',
    opcoesKey: 'relacaoFormacao',
  },
  {
    id: 'tempoPrimeiroEmprego',
    icone: 'clock',
    rotulo: 'Tempo até o 1º emprego',
    editor: 'opcoes',
    campo: 'tempoPrimeiroEmprego',
    opcoesKey: 'tempoPrimeiroEmprego',
  },
  {
    id: 'posGraduacao',
    icone: 'cap',
    rotulo: 'Pós-graduação',
    editor: 'pos',
    ajuda: 'Especialização, mestrado, doutorado, MBA…',
  },
]
