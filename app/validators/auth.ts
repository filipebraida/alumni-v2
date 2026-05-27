import vine from '@vinejs/vine'

/** Valida o e-mail usado para solicitar um código de acesso. */
export const solicitarCodigoValidator = vine.create({
  email: vine.string().trim().toLowerCase().email().maxLength(254),
})

/** Valida o código de 6 dígitos enviado para entrar. */
export const verificarCodigoValidator = vine.create({
  code: vine
    .string()
    .trim()
    .regex(/^\d{6}$/),
})
