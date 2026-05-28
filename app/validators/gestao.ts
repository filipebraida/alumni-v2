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
})
