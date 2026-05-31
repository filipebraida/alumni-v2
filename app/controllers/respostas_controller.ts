import type { HttpContext } from '@adonisjs/core/http'

import { registrarRespostaValidator } from '#validators/resposta'
import { SETORES, SETOR_LABELS } from '#enums/setor'
import { FAIXAS_SALARIAIS, FAIXA_SALARIAL_LABELS } from '#enums/faixa_salarial'
import { RELACOES_FORMACAO, RELACAO_FORMACAO_LABELS } from '#enums/relacao_formacao'
import {
  TEMPOS_PRIMEIRO_EMPREGO,
  TEMPO_PRIMEIRO_EMPREGO_LABELS,
} from '#enums/tempo_primeiro_emprego'

import BuscarEgressoDoUsuario from '#queries/buscar_egresso_do_usuario'
import BuscarUltimaRespostaPessoaDoEgresso from '#queries/buscar_ultima_resposta_pessoa_do_egresso'
import BuscarUltimasRespostasCursoDasMatriculas from '#queries/buscar_ultimas_respostas_curso_das_matriculas'
import RegistrarRevisaoDoEgresso from '#actions/registrar_revisao_do_egresso'
import MatriculaTransformer from '#transformers/matricula_transformer'
import OpcoesTransformer from '#transformers/opcoes_transformer'
import RespostaPessoaTransformer from '#transformers/resposta_pessoa_transformer'

/**
 * Fluxo de revisão (wizard): o egresso revisita os dados gerais + os campos
 * de cada matrícula não-evadida e envia. Cada envio = 1 RespostaPessoa nova +
 * N RespostaCurso (uma por matrícula). Append-only.
 */
export default class RespostasController {
  async create({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: user.id })
    const matriculas = egresso!.matriculas.filter((m) => m.situacao !== 'evadido')

    const ultimaPessoa = await new BuscarUltimaRespostaPessoaDoEgresso().handle({
      egressoId: egresso!.id,
    })
    const ultimasCurso = await new BuscarUltimasRespostasCursoDasMatriculas().handle({
      matriculaIds: matriculas.map((m) => m.id),
    })

    return inertia.render('respostas/create', {
      valores: ultimaPessoa
        ? RespostaPessoaTransformer.transform(ultimaPessoa).useVariant('forRevisao')
        : {
            localizacaoCidade: null,
            localizacaoUf: null,
            localizacaoPais: null,
            empregador: null,
            cargo: null,
            setor: null,
          },
      matriculas: MatriculaTransformer.transform(matriculas, {
        revisao: ultimasCurso,
      }).useVariant('forRevisao'),
      opcoes: OpcoesTransformer.transform({
        setor: SETORES.map((v) => ({ valor: v, rotulo: SETOR_LABELS[v] })),
        faixaSalarial: FAIXAS_SALARIAIS.map((v) => ({
          valor: v,
          rotulo: FAIXA_SALARIAL_LABELS[v],
        })),
        relacaoFormacao: RELACOES_FORMACAO.map((v) => ({
          valor: v,
          rotulo: RELACAO_FORMACAO_LABELS[v],
        })),
        tempoPrimeiroEmprego: TEMPOS_PRIMEIRO_EMPREGO.map((v) => ({
          valor: v,
          rotulo: TEMPO_PRIMEIRO_EMPREGO_LABELS[v],
        })),
      }),
    })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(registrarRespostaValidator)

    const user = auth.getUserOrFail()
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: user.id })

    await new RegistrarRevisaoDoEgresso().handle({
      egressoId: egresso!.id,
      payload,
    })

    session.flash(
      'success',
      'Pronto! Seus dados foram atualizados — obrigado por manter seu cadastro fresquinho.'
    )
    return response.redirect().toRoute('dashboard')
  }
}
