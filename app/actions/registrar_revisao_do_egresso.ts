import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import RespostaPessoa from '#models/resposta_pessoa'
import RespostaCurso from '#models/resposta_curso'
import Matricula from '#models/matricula'
import type { Setor } from '#enums/setor'
import type { FaixaSalarial } from '#enums/faixa_salarial'
import type { RelacaoFormacao } from '#enums/relacao_formacao'
import type { TempoPrimeiroEmprego } from '#enums/tempo_primeiro_emprego'

export interface PayloadDadosGerais {
  localizacaoCidade?: string | null
  localizacaoUf?: string | null
  localizacaoPais?: string | null
  empregador?: string | null
  cargo?: string | null
  setor?: Setor | null
}

export interface PayloadMatricula {
  id: number
  faixaSalarial?: FaixaSalarial | null
  relacaoFormacao?: RelacaoFormacao | null
  tempoPrimeiroEmprego?: TempoPrimeiroEmprego | null
}

export interface RegistrarRevisaoDoEgressoInput {
  egressoId: number
  payload: PayloadDadosGerais & {
    matriculas: PayloadMatricula[]
  }
}

/**
 * Recebe a submissão completa do wizard de revisão e cria, numa transação,
 * uma `RespostaPessoa` nova + N `RespostaCurso` (uma por matrícula
 * não-evadida do egresso no instante).
 *
 * Regras:
 * - Matriculas[].id alheios ou evadidos são **descartados silenciosamente** —
 *   a verdade vem do banco, não do cliente.
 * - Toda matrícula não-evadida do egresso vira uma linha em respostas_curso,
 *   mesmo quando o cliente não enviou entrada (campos vão null ou herdados).
 * - Campos não enviados (undefined) herdam o valor da última RespostaPessoa /
 *   RespostaCurso correspondente. Envio explícito de null zera o campo.
 * - Para matrículas com nivel ≠ 'graduacao', os 3 campos próprios ficam null
 *   (identidade-só nesta entrega).
 */
export default class RegistrarRevisaoDoEgresso {
  async handle({ egressoId, payload }: RegistrarRevisaoDoEgressoInput): Promise<RespostaPessoa> {
    // 1) Verdade do banco: matrículas próprias e não-evadidas.
    const matriculas = await Matricula.query()
      .where('egressoId', egressoId)
      .whereNot('situacao', 'evadido')
      .preload('curso')

    if (matriculas.length === 0) {
      throw new Error('Egresso sem matrículas ativas — não pode registrar revisão.')
    }

    const matriculasIds = new Set(matriculas.map((m) => m.id))
    const enviadasPorId = new Map<number, PayloadMatricula>()
    for (const item of payload.matriculas) {
      if (matriculasIds.has(item.id)) enviadasPorId.set(item.id, item)
    }

    // 2) Última resposta anterior pra herdar campos não tocados.
    const ultimaPessoa = await RespostaPessoa.query()
      .where('egressoId', egressoId)
      .orderBy('registradaEm', 'desc')
      .first()

    const ultimaCursoPorMatricula = new Map<number, RespostaCurso>()
    if (matriculas.length > 0) {
      const todasCurso = await RespostaCurso.query()
        .whereIn(
          'matriculaId',
          matriculas.map((m) => m.id)
        )
        .orderBy('ano', 'desc')
      for (const rc of todasCurso) {
        if (!ultimaCursoPorMatricula.has(rc.matriculaId)) {
          ultimaCursoPorMatricula.set(rc.matriculaId, rc)
        }
      }
    }

    const agora = DateTime.now()
    const ano = agora.year

    return db.transaction(async (trx) => {
      const pessoa = new RespostaPessoa()
      pessoa.useTransaction(trx)
      pessoa.egressoId = egressoId
      pessoa.ano = ano
      pessoa.registradaEm = agora
      pessoa.localizacaoCidade =
        payload.localizacaoCidade !== undefined
          ? payload.localizacaoCidade
          : (ultimaPessoa?.localizacaoCidade ?? null)
      pessoa.localizacaoUf =
        payload.localizacaoUf !== undefined
          ? payload.localizacaoUf
          : (ultimaPessoa?.localizacaoUf ?? null)
      pessoa.localizacaoPais =
        payload.localizacaoPais !== undefined
          ? payload.localizacaoPais
          : (ultimaPessoa?.localizacaoPais ?? null)
      pessoa.empregador =
        payload.empregador !== undefined ? payload.empregador : (ultimaPessoa?.empregador ?? null)
      pessoa.cargo = payload.cargo !== undefined ? payload.cargo : (ultimaPessoa?.cargo ?? null)
      pessoa.setor = payload.setor !== undefined ? payload.setor : (ultimaPessoa?.setor ?? null)
      await pessoa.save()

      for (const matricula of matriculas) {
        const ehGraduacao = matricula.curso.nivel === 'graduacao'
        const enviada = enviadasPorId.get(matricula.id)
        const ultima = ultimaCursoPorMatricula.get(matricula.id)

        const curso = new RespostaCurso()
        curso.useTransaction(trx)
        curso.respostaPessoaId = pessoa.id
        curso.matriculaId = matricula.id
        curso.ano = ano

        if (ehGraduacao) {
          curso.faixaSalarial =
            enviada?.faixaSalarial !== undefined
              ? enviada.faixaSalarial
              : (ultima?.faixaSalarial ?? null)
          curso.relacaoFormacao =
            enviada?.relacaoFormacao !== undefined
              ? enviada.relacaoFormacao
              : (ultima?.relacaoFormacao ?? null)
          curso.tempoPrimeiroEmprego =
            enviada?.tempoPrimeiroEmprego !== undefined
              ? enviada.tempoPrimeiroEmprego
              : (ultima?.tempoPrimeiroEmprego ?? null)
        } else {
          // Pós: identidade-só nesta entrega — 3 colunas null por construção.
          curso.faixaSalarial = null
          curso.relacaoFormacao = null
          curso.tempoPrimeiroEmprego = null
        }

        await curso.save()
      }

      return pessoa
    })
  }
}
