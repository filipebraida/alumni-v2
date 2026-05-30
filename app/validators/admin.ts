import vine from '@vinejs/vine'
import { NIVEIS_ACADEMICOS } from '#enums/nivel_academico'

/** Cadastro de um Instituto novo. Código curto (chave natural) + nome. */
export const criarInstitutoValidator = vine.create({
  codigo: vine
    .string()
    .trim()
    .toUpperCase()
    .minLength(2)
    .maxLength(16)
    .regex(/^[A-Z0-9-]+$/),
  nome: vine.string().trim().minLength(3).maxLength(120),
})

/** Cadastro de um Curso novo, vinculado a um Instituto existente. */
export const criarCursoValidator = vine.create({
  codigo: vine.string().trim().minLength(2).maxLength(32),
  nome: vine.string().trim().minLength(3).maxLength(160),
  nivel: vine.enum(NIVEIS_ACADEMICOS),
  institutoId: vine.number().withoutDecimals().positive(),
})
