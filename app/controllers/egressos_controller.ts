import type { HttpContext } from '@adonisjs/core/http'
import ListarEgressosDoCurso, { rosterVazio } from '#queries/listar_egressos_do_curso'
import ListarTurmasDoCurso from '#queries/listar_turmas_do_curso'
import ResumoEgressosDoCurso from '#queries/resumo_egressos_do_curso'
import CadastrarEgressoNoCurso from '#actions/cadastrar_egresso_no_curso'
import { cadastrarEgressoValidator, listarEgressosValidator } from '#validators/gestao'

/**
 * Lista de egressos do curso ativo para a gestão analisar. Paginação e filtros
 * (busca + situação + turma) são resolvidos no servidor; o curso ativo (tenant)
 * vem do `gestor` middleware. `store` adiciona um egresso direto ao roster.
 */
export default class EgressosController {
  async index({ gestao, inertia, request }: HttpContext) {
    const { cursoAtivo } = gestao
    const { page, perPage, q, situacoes, turma } =
      await request.validateUsing(listarEgressosValidator)

    const resultado = cursoAtivo
      ? await new ListarEgressosDoCurso().handle({
          cursoId: cursoAtivo.id,
          page: page ?? 1,
          perPage: perPage ?? 10,
          q,
          situacoes,
          turma,
        })
      : rosterVazio(perPage ?? 10)

    const [estatisticas, turmas] = cursoAtivo
      ? await Promise.all([
          new ResumoEgressosDoCurso().handle({ cursoId: cursoAtivo.id }),
          new ListarTurmasDoCurso().handle({ cursoId: cursoAtivo.id }),
        ])
      : [null, []]

    return inertia.render('gestao/egressos', {
      egressos: { data: resultado.data, metadata: resultado.meta },
      estatisticas,
      turmas,
      q: q ?? null,
      situacoes: situacoes ?? [],
      turma: turma ?? null,
    })
  }

  async store({ gestao, request, response, session }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      session.flash('error', 'Selecione um curso antes de cadastrar um egresso.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const payload = await request.validateUsing(cadastrarEgressoValidator)
    const resultado = await new CadastrarEgressoNoCurso().handle({
      cursoId: cursoAtivo.id,
      ...payload,
    })

    session.flash(
      'success',
      resultado.status === 'criado'
        ? `${resultado.nome} foi cadastrado(a) em ${cursoAtivo.nome}.`
        : `${resultado.nome} já constava no curso; os dados foram atualizados.`
    )
    return response.redirect().toRoute('gestao.egressos')
  }
}
