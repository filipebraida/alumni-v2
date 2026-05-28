import type { HttpContext } from '@adonisjs/core/http'
import { trocarCursoAtivoValidator } from '#validators/gestao'
import { CURSO_GESTAO_ATIVO_KEY } from '#middleware/gestor_middleware'

/** Troca o curso ativo da área de gestão (alvo do CursoSwitcher). */
export default class CursoAtivoController {
  async update({ request, response, session, gestao }: HttpContext) {
    const { cursoId } = await request.validateUsing(trocarCursoAtivoValidator)

    // Só permite ativar um curso que o gestor realmente gere.
    if (gestao.gestor.cursos.some((curso) => curso.id === cursoId)) {
      session.put(CURSO_GESTAO_ATIVO_KEY, cursoId)
    }

    return response.redirect().back()
  }
}
