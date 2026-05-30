import type { HttpContext } from '@adonisjs/core/http'
import { trocarCursoAtivoValidator } from '#validators/gestao'
import { CURSO_GESTAO_ATIVO_KEY } from '#middleware/gestor_middleware'

/** Troca o curso ativo da área de gestão (alvo do CursoSwitcher). */
export default class CursoAtivoController {
  async update({ request, response, session, gestao }: HttpContext) {
    const { cursoId } = await request.validateUsing(trocarCursoAtivoValidator)

    // `gestao.cursos` = pivot do gestor, ou todos os cursos se admin.
    if (gestao.cursos.some((curso) => curso.id === cursoId)) {
      session.put(CURSO_GESTAO_ATIVO_KEY, cursoId)
    }

    return response.redirect().back()
  }
}
