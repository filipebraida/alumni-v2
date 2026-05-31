import type { HttpContext } from '@adonisjs/core/http'
import ListarEgressosDoCurso, { rosterVazio } from '#queries/listar_egressos_do_curso'
import ListarTurmasDoCurso from '#queries/listar_turmas_do_curso'
import ResumoEgressosDoCurso from '#queries/resumo_egressos_do_curso'
import BuscarEgressoPorCpf from '#queries/buscar_egresso_por_cpf'
import BuscarEgressoDoCurso from '#queries/buscar_egresso_do_curso'
import RespostaPessoaTransformer from '#transformers/resposta_pessoa_transformer'
import CadastrarEgressoNoCurso from '#actions/cadastrar_egresso_no_curso'
import EnviarPedidoDeAtualizacao from '#actions/enviar_pedido_de_atualizacao'
import VincularEgressoAoCurso from '#actions/vincular_egresso_ao_curso'
import {
  cadastrarEgressoValidator,
  listarEgressosValidator,
  lookupEgressoValidator,
  mostrarEgressoValidator,
  pedirAtualizacaoValidator,
  vincularEgressoValidator,
} from '#validators/gestao'

/**
 * Lista de egressos do curso ativo para a gestão analisar. Paginação e filtros
 * (busca + situação + turma) são resolvidos no servidor; o curso ativo (tenant)
 * vem do `gestor` middleware. `lookup` informa o dialog de cadastro sobre o
 * estado do CPF; `store` cria um egresso novo; `vincular` adiciona um egresso
 * já existente ao roster do curso ativo.
 */
export default class EgressosController {
  async index({ gestao, inertia, request }: HttpContext) {
    const { cursoAtivo } = gestao
    const { page, perPage, q, situacoes, turma, sort, order } =
      await request.validateUsing(listarEgressosValidator)

    const resultado = cursoAtivo
      ? await new ListarEgressosDoCurso().handle({
          cursoId: cursoAtivo.id,
          page: page ?? 1,
          perPage: perPage ?? 10,
          q,
          situacoes,
          turma,
          sort,
          order,
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
      sort: sort ?? null,
      order: order ?? null,
    })
  }

  async show({ gestao, params, inertia, response, session }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      session.flash('error', 'Selecione um curso antes de abrir o perfil de um egresso.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const { egressoId } = await mostrarEgressoValidator.validate(params)
    const detalhe = await new BuscarEgressoDoCurso().handle({
      egressoId,
      cursoId: cursoAtivo.id,
    })

    if (!detalhe) {
      session.flash('error', 'Egresso não encontrado neste curso.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const { egresso, matricula, respostaAtual, statusFrescor } = detalhe
    return inertia.render('gestao/egresso', {
      egresso: {
        id: egresso.id,
        nomeCompleto: egresso.nomeCompleto,
        cpf: egresso.cpf,
        emailLogin: egresso.user?.email ?? null,
        emailPessoal: egresso.emailPessoal,
        consentimentoEm: egresso.consentimentoEm?.toISO() ?? null,
      },
      matricula: {
        codigo: matricula.codigo,
        situacao: matricula.situacao,
        periodoFormatura: matricula.periodoFormatura,
        dataColacao: matricula.dataColacao?.toISODate() ?? null,
        curso: {
          nome: matricula.curso.nome,
          codigo: matricula.curso.codigo,
          nivel: matricula.curso.nivel,
          instituto: matricula.curso.instituto.nome,
        },
      },
      respostaAtual: respostaAtual ? RespostaPessoaTransformer.transform(respostaAtual) : null,
      statusFrescor,
    })
  }

  async lookup({ gestao, request, response }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      return response.status(409).send({ erro: 'sem_curso_ativo' })
    }

    const { cpf } = await request.validateUsing(lookupEgressoValidator)
    const resultado = await new BuscarEgressoPorCpf().handle({
      cpf,
      cursoAtivoId: cursoAtivo.id,
    })

    return response.send(resultado)
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

    if (resultado.status === 'criado') {
      session.flash('success', `${resultado.nome} foi cadastrado(a) em ${cursoAtivo.nome}.`)
      return response.redirect().toRoute('gestao.egressos')
    }

    const erros: Record<string, string> = {}
    if (resultado.status === 'cpf_em_uso') {
      erros.cpf = 'Já existe um egresso cadastrado com este CPF.'
    } else if (resultado.status === 'email_em_uso') {
      erros.email = 'Este e-mail já está cadastrado.'
    } else if (resultado.status === 'matricula_em_uso') {
      erros.matriculaCodigo = 'Esta matrícula já pertence a outro egresso.'
    }
    session.flashErrors(erros)
    return response.redirect().back()
  }

  /**
   * Coordenacao pede atualizacao do questionario para N egressos do curso ativo.
   * Cada egresso com User recebe e-mail + notificacao no sino (clique leva
   * para `respostas.create`). Egressos sem User entram no balde "sem usuario".
   */
  async pedirAtualizacao({ auth, gestao, request, response, session }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      session.flash('error', 'Selecione um curso antes de pedir atualização.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const { egressoIds, mensagem } = await request.validateUsing(pedirAtualizacaoValidator)
    const usuario = auth.getUserOrFail()

    const resultado = await new EnviarPedidoDeAtualizacao().handle({
      egressoIds,
      cursoId: cursoAtivo.id,
      nomeCurso: cursoAtivo.nome,
      nomeGestor: usuario.fullName ?? usuario.email,
      mensagem: mensagem ?? null,
    })

    const { enviados, semUsuario } = resultado
    const mensagemSucesso = semUsuario
      ? `Pedido enviado a ${enviados} egresso${enviados === 1 ? '' : 's'}. ` +
        `${semUsuario} ainda não acessou o portal e não foi notificado.`
      : `Pedido enviado a ${enviados} egresso${enviados === 1 ? '' : 's'}.`
    session.flash(enviados > 0 ? 'success' : 'error', mensagemSucesso)
    return response.redirect().back()
  }

  async vincular({ gestao, request, response, session }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      session.flash('error', 'Selecione um curso antes de vincular um egresso.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const payload = await request.validateUsing(vincularEgressoValidator)
    const resultado = await new VincularEgressoAoCurso().handle({
      cursoId: cursoAtivo.id,
      ...payload,
    })

    if (resultado.status === 'vinculado') {
      session.flash('success', `${resultado.nome} foi vinculado(a) a ${cursoAtivo.nome}.`)
      return response.redirect().toRoute('gestao.egressos')
    }

    if (resultado.status === 'matricula_em_uso') {
      session.flashErrors({
        matriculaCodigo: 'Esta matrícula já pertence a outro egresso.',
      })
      return response.redirect().back()
    }

    session.flash(
      'error',
      resultado.status === 'ja_no_curso'
        ? 'Este egresso já está cadastrado neste curso.'
        : 'Não foi possível localizar o egresso para vincular.'
    )
    return response.redirect().toRoute('gestao.egressos')
  }
}
