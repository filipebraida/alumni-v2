import vine from '@vinejs/vine'
import { SITUACOES_MATRICULA } from '#enums/situacao_matricula'

/** Valida a troca de curso ativo no CursoSwitcher. */
export const trocarCursoAtivoValidator = vine.create({
  cursoId: vine.number().positive(),
})

/** Valida os parâmetros da listagem paginada/filtrada de egressos da gestão. */
export const listarEgressosValidator = vine.create({
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
  q: vine.string().trim().minLength(1).maxLength(255).optional(),
  situacoes: vine.array(vine.enum(SITUACOES_MATRICULA)).optional(),
  turma: vine.string().trim().minLength(1).maxLength(20).optional(),
})

/** Valida o cadastro direto de um egresso no roster do curso ativo. */
export const cadastrarEgressoValidator = vine.create({
  nomeCompleto: vine.string().trim().minLength(3).maxLength(255),
  email: vine.string().trim().toLowerCase().email().maxLength(255),
  cpf: vine.string().trim().minLength(11).maxLength(14),
  matriculaCodigo: vine.string().trim().minLength(3).maxLength(30),
  situacao: vine.enum(SITUACOES_MATRICULA),
  periodoFormatura: vine.string().trim().minLength(1).maxLength(20).optional(),
})
