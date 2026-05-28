import type { HttpContext } from '@adonisjs/core/http'
import { registrarRespostaValidator } from '#validators/resposta'
import { SETORES, SETOR_LABELS } from '#enums/setor'
import { FAIXAS_SALARIAIS, FAIXA_SALARIAL_LABELS } from '#enums/faixa_salarial'
import { RELACOES_FORMACAO, RELACAO_FORMACAO_LABELS } from '#enums/relacao_formacao'
import {
  TEMPOS_PRIMEIRO_EMPREGO,
  TEMPO_PRIMEIRO_EMPREGO_LABELS,
} from '#enums/tempo_primeiro_emprego'
import { NIVEIS_POS, NIVEL_LABELS } from '#enums/nivel_academico'
import { STATUS_POS, STATUS_POS_LABELS } from '#enums/status_pos'

/**
 * Fluxo de atualização ("Confirmar dados"): o egresso revalida/edita os campos
 * MEC e envia. Cada envio = uma nova foto (`resposta`) append-only.
 *
 * Por ora os valores atuais são fictícios e `store` apenas valida + redireciona;
 * a persistência da foto entra via `#actions` quando o lado de leitura for real.
 */
export default class RespostasController {
  /** Renderiza o formulário com os valores atuais e as opções de cada campo. */
  async create({ inertia }: HttpContext) {
    return inertia.render('respostas/create', {
      valores: {
        localizacaoCidade: 'Rio de Janeiro',
        localizacaoUf: 'RJ',
        localizacaoPais: 'Brasil',
        empregador: 'Embrapa Solos',
        cargo: 'Engenheira de Software',
        setor: 'pesquisa_publica',
        faixaSalarial: 'de_9k_12k',
        relacaoFormacao: 'total',
        tempoPrimeiroEmprego: null,
        posGrau: 'mestrado',
        posCurso: 'Informática',
        posInstituicao: 'UFRJ',
        posStatus: 'cursando',
      },
      opcoes: {
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
        posGrau: NIVEIS_POS.map((v) => ({ valor: v, rotulo: NIVEL_LABELS[v] })),
        posStatus: STATUS_POS.map((v) => ({ valor: v, rotulo: STATUS_POS_LABELS[v] })),
      },
    })
  }

  /** Valida o envio e (futuramente) grava a foto. Hoje: flash + volta ao painel. */
  async store({ request, response, session }: HttpContext) {
    await request.validateUsing(registrarRespostaValidator)

    // TODO: persistir a foto via #actions (resolver egresso do usuário + ano de
    // referência) quando a leitura do painel deixar de ser fictícia.

    session.flash(
      'success',
      'Pronto! Seus dados foram atualizados — obrigado por manter seu cadastro fresquinho.'
    )
    return response.redirect().toRoute('dashboard')
  }
}
