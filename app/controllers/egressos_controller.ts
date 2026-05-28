import type { HttpContext } from '@adonisjs/core/http'
import ListarEgressosDoCurso, { rosterVazio } from '#queries/listar_egressos_do_curso'
import { listarEgressosValidator } from '#validators/gestao'

/**
 * Lista de egressos do curso ativo para a gestão analisar. Paginação e filtros
 * (busca + situação) são resolvidos no servidor; o curso ativo (tenant) vem do
 * `gestor` middleware.
 */
export default class EgressosController {
  async index({ gestao, inertia, request }: HttpContext) {
    const { cursoAtivo } = gestao
    const { page, perPage, q, situacoes } = await request.validateUsing(listarEgressosValidator)

    const resultado = cursoAtivo
      ? await new ListarEgressosDoCurso().handle({
          cursoId: cursoAtivo.id,
          page: page ?? 1,
          perPage: perPage ?? 10,
          q,
          situacoes,
        })
      : rosterVazio(perPage ?? 10)

    return inertia.render('gestao/egressos', {
      egressos: { data: resultado.data, metadata: resultado.meta },
      q: q ?? null,
      situacoes: situacoes ?? [],
    })
  }
}
