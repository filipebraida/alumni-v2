import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

// Shared prop `gestao` montado pelo gestor_middleware (não passa por
// InertiaMiddleware.share, então não entra em Data.SharedProps automaticamente).
export type CursoResumo = {
  id: number
  nome: string
  codigo: string
  nivel: string
  instituto: string
}

export type GestaoShared = {
  cursoAtivoId: number | null
  isAdmin: boolean
  cursos: CursoResumo[]
}
