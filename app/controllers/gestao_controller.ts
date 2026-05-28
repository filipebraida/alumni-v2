import type { HttpContext } from '@adonisjs/core/http'
import EstatisticasDoCurso from '#queries/estatisticas_do_curso'

/**
 * Visão geral da gestão. O curso ativo e a lista de cursos chegam via shared
 * props (`gestao`, resolvidas no `gestor` middleware); aqui só calculamos as
 * métricas do curso ativo.
 */
export default class GestaoController {
  async show({ gestao, inertia }: HttpContext) {
    const { cursoAtivo } = gestao
    const estatisticas = cursoAtivo
      ? await new EstatisticasDoCurso().handle({ cursoId: cursoAtivo.id })
      : null

    return inertia.render('gestao/dashboard', { estatisticas })
  }
}
