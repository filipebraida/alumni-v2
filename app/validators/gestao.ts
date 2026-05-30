import vine from '@vinejs/vine'
import { SITUACOES_MATRICULA } from '#enums/situacao_matricula'

/** Valida a troca de curso ativo no CursoSwitcher. */
export const trocarCursoAtivoValidator = vine.create({
  cursoId: vine.number().positive(),
})

export const mostrarEgressoValidator = vine.create({
  egressoId: vine.number().withoutDecimals().positive(),
})

/** Colunas pelas quais a listagem de egressos pode ser ordenada. */
export const ORDENAVEIS_EGRESSOS = ['egresso', 'turma', 'situacao', 'status'] as const

/** Valida os parâmetros da listagem paginada/filtrada de egressos da gestão. */
export const listarEgressosValidator = vine.create({
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
  q: vine.string().trim().minLength(1).maxLength(255).optional(),
  situacoes: vine.array(vine.enum(SITUACOES_MATRICULA)).optional(),
  turma: vine.string().trim().minLength(1).maxLength(20).optional(),
  sort: vine.enum(ORDENAVEIS_EGRESSOS).optional(),
  order: vine.enum(['asc', 'desc'] as const).optional(),
})

/** Valida o lookup de egresso por CPF na busca antes do cadastro. */
export const lookupEgressoValidator = vine.create({
  cpf: vine.string().trim().minLength(11).maxLength(14),
})

/** Valida o cadastro de um egresso NOVO no roster do curso ativo. */
export const cadastrarEgressoValidator = vine.create({
  nomeCompleto: vine.string().trim().minLength(3).maxLength(255),
  email: vine.string().trim().toLowerCase().email().maxLength(255),
  cpf: vine.string().trim().minLength(11).maxLength(14),
  matriculaCodigo: vine.string().trim().minLength(3).maxLength(30),
  situacao: vine.enum(SITUACOES_MATRICULA),
  periodoFormatura: vine.string().trim().minLength(1).maxLength(20).optional(),
})

/** Valida o vínculo de um egresso EXISTENTE ao curso ativo. */
export const vincularEgressoValidator = vine.create({
  egressoId: vine.number().withoutDecimals().positive(),
  matriculaCodigo: vine.string().trim().minLength(3).maxLength(30),
  situacao: vine.enum(SITUACOES_MATRICULA),
  periodoFormatura: vine.string().trim().minLength(1).maxLength(20).optional(),
})

/** Valida o upload da planilha (CSV) de egressos para o curso ativo. */
export const importarEgressosValidator = vine.create({
  arquivo: vine.file({ size: '5mb', extnames: ['csv', 'txt'] }),
})
