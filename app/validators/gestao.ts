import vine from '@vinejs/vine'

/** Valida a troca de curso ativo no CursoSwitcher. */
export const trocarCursoAtivoValidator = vine.create({
  cursoId: vine.number().positive(),
})
