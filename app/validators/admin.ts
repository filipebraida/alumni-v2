import vine from '@vinejs/vine'
import { NIVEIS_ACADEMICOS } from '#enums/nivel_academico'
import { MODALIDADES_PROGRAMA } from '#enums/modalidade_programa'

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

export const atualizarInstitutoValidator = vine.create({
  codigo: vine
    .string()
    .trim()
    .toUpperCase()
    .minLength(2)
    .maxLength(16)
    .regex(/^[A-Z0-9-]+$/),
  nome: vine.string().trim().minLength(3).maxLength(120),
  ativo: vine.boolean(),
})

/**
 * Cadastro de um Curso novo, vinculado a um Instituto existente.
 * `programaId` é opcional aqui — a obrigatoriedade quando `nivel` ≠ graduação
 * e a consistência de instituto são validadas no action `CriarCurso`.
 */
export const criarCursoValidator = vine.create({
  codigo: vine.string().trim().minLength(2).maxLength(32),
  nome: vine.string().trim().minLength(3).maxLength(160),
  nivel: vine.enum(NIVEIS_ACADEMICOS),
  institutoId: vine.number().withoutDecimals().positive(),
  programaId: vine.number().withoutDecimals().positive().optional(),
})

export const atualizarCursoValidator = vine.create({
  codigo: vine.string().trim().minLength(2).maxLength(32),
  nome: vine.string().trim().minLength(3).maxLength(160),
  nivel: vine.enum(NIVEIS_ACADEMICOS),
  institutoId: vine.number().withoutDecimals().positive(),
  programaId: vine.number().withoutDecimals().positive().optional(),
  ativo: vine.boolean(),
})

export const criarUsuarioValidator = vine.create({
  email: vine.string().trim().toLowerCase().email().maxLength(254),
  fullName: vine.string().trim().minLength(3).maxLength(255),
  isAdmin: vine.boolean().optional(),
  cursosIds: vine.array(vine.number().withoutDecimals().positive()).distinct().optional(),
})

export const atualizarUsuarioValidator = vine.create({
  fullName: vine.string().trim().minLength(3).maxLength(255),
  isAdmin: vine.boolean().optional(),
  cursosIds: vine.array(vine.number().withoutDecimals().positive()).distinct().optional(),
})

export const listarInstitutosValidator = vine.create({
  q: vine.string().trim().minLength(1).maxLength(120).optional(),
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
})

/** Cadastro de um Programa (PPG) novo, vinculado a um Instituto existente. */
export const criarProgramaValidator = vine.create({
  codigo: vine.string().trim().minLength(2).maxLength(32),
  nome: vine.string().trim().minLength(3).maxLength(160),
  sigla: vine.string().trim().minLength(2).maxLength(32).optional(),
  modalidade: vine.enum(MODALIDADES_PROGRAMA).optional(),
  institutoId: vine.number().withoutDecimals().positive(),
})

export const atualizarProgramaValidator = vine.create({
  codigo: vine.string().trim().minLength(2).maxLength(32),
  nome: vine.string().trim().minLength(3).maxLength(160),
  sigla: vine.string().trim().minLength(2).maxLength(32).optional(),
  modalidade: vine.enum(MODALIDADES_PROGRAMA).optional(),
  institutoId: vine.number().withoutDecimals().positive(),
  ativo: vine.boolean(),
})

export const listarProgramasValidator = vine.create({
  q: vine.string().trim().minLength(1).maxLength(120).optional(),
  institutoId: vine.number().withoutDecimals().positive().optional(),
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
})

export const listarCursosValidator = vine.create({
  q: vine.string().trim().minLength(1).maxLength(120).optional(),
  nivel: vine.enum(NIVEIS_ACADEMICOS).optional(),
  institutoId: vine.number().withoutDecimals().positive().optional(),
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
})

export const TIPOS_FILTRO_USUARIO = ['admin', 'coordenador', 'sem_papel'] as const
export type TipoFiltroUsuario = (typeof TIPOS_FILTRO_USUARIO)[number]

export const listarUsuariosValidator = vine.create({
  q: vine.string().trim().minLength(1).maxLength(120).optional(),
  tipo: vine.enum(TIPOS_FILTRO_USUARIO).optional(),
  page: vine.number().withoutDecimals().positive().optional(),
  perPage: vine.number().withoutDecimals().positive().optional(),
})
