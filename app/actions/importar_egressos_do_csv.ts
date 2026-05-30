import { parse } from 'csv-parse/sync'
import db from '@adonisjs/lucid/services/db'

import User from '#models/user'
import Egresso from '#models/egresso'
import Matricula from '#models/matricula'
import { SITUACOES_MATRICULA, type SituacaoMatricula } from '#enums/situacao_matricula'

/** Cabeçalho esperado na planilha — mesma forma do formulário de cadastro. */
export const COLUNAS_IMPORTACAO = [
  'nomeCompleto',
  'email',
  'cpf',
  'matriculaCodigo',
  'situacao',
  'periodoFormatura',
] as const

export type ImportarEgressosDoCsvInput = {
  cursoId: number
  conteudo: string
}

export type LinhaRejeitada = {
  linha: number
  motivo: string
  nome?: string
  cpf?: string
}

export type ImportacaoEgressosRelatorio = {
  total: number
  novos: number
  vinculados: number
  atualizados: number
  inalterados: number
  rejeitados: LinhaRejeitada[]
}

/**
 * Importa egressos de uma planilha CSV para o roster do curso. Política do CPF:
 *  - CPF inexistente → cria User + Egresso + Matrícula (balde "novos").
 *  - CPF já cadastrado fora do curso → cria só a Matrícula (balde "vinculados").
 *  - CPF já cadastrado e neste curso → atualiza só `situacao` e
 *    `periodoFormatura` da matrícula existente (balde "atualizados") OU, se os
 *    valores já batem com o que está no banco, contabiliza como "inalterados"
 *    sem tocar no registro. Identidade (nome, CPF, e-mail) nunca é sobrescrita.
 *  - Conflito de matriculaCodigo, CPF inválido ou e-mail duplicado de outro
 *    user → rejeita a linha (balde "rejeitados"), informando o motivo.
 * Cada linha roda em sua própria transação; uma linha rejeitada não desfaz as
 * outras.
 */
export default class ImportarEgressosDoCsv {
  async handle({
    cursoId,
    conteudo,
  }: ImportarEgressosDoCsvInput): Promise<ImportacaoEgressosRelatorio> {
    const relatorio: ImportacaoEgressosRelatorio = {
      total: 0,
      novos: 0,
      vinculados: 0,
      atualizados: 0,
      inalterados: 0,
      rejeitados: [],
    }

    let registros: Record<string, string>[]
    try {
      registros = parse(conteudo, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      }) as Record<string, string>[]
    } catch {
      relatorio.rejeitados.push({ linha: 0, motivo: 'CSV inválido ou mal formatado.' })
      return relatorio
    }

    relatorio.total = registros.length

    for (const [indice, dados] of registros.entries()) {
      // Header é a linha 1 do arquivo, então o índice 0 corresponde à linha 2.
      const numeroLinha = indice + 2
      const erroValidacao = validarLinha(dados)
      if (erroValidacao) {
        relatorio.rejeitados.push({
          linha: numeroLinha,
          motivo: erroValidacao,
          nome: dados.nomeCompleto?.trim(),
          cpf: dados.cpf?.trim(),
        })
        continue
      }

      const cpf = dados.cpf.replace(/\D/g, '')
      const email = dados.email.trim().toLowerCase()
      const nomeCompleto = dados.nomeCompleto.trim()
      const matriculaCodigo = dados.matriculaCodigo.trim()
      const situacao = dados.situacao.trim() as SituacaoMatricula
      const periodoFormatura = dados.periodoFormatura?.trim() || null

      try {
        const resultado = await db.transaction(async (trx) => {
          const egressoExistente = await Egresso.query({ client: trx }).where('cpf', cpf).first()

          if (egressoExistente) {
            const matriculaNoCurso = await Matricula.query({ client: trx })
              .where('egressoId', egressoExistente.id)
              .where('cursoId', cursoId)
              .first()

            if (matriculaNoCurso) {
              matriculaNoCurso.situacao = situacao
              matriculaNoCurso.periodoFormatura = periodoFormatura
              if (!matriculaNoCurso.$isDirty) return { balde: 'inalterados' as const }
              await matriculaNoCurso.useTransaction(trx).save()
              return { balde: 'atualizados' as const }
            }

            const matriculaEmUso = await Matricula.query({ client: trx })
              .where('codigo', matriculaCodigo)
              .first()
            if (matriculaEmUso) {
              return {
                balde: 'rejeitados' as const,
                motivo: 'Matrícula já pertence a outro egresso.',
              }
            }

            await Matricula.create(
              {
                codigo: matriculaCodigo,
                cursoId,
                egressoId: egressoExistente.id,
                situacao,
                periodoFormatura,
              },
              { client: trx }
            )
            return { balde: 'vinculados' as const }
          }

          const emailEmUso = await User.query({ client: trx }).where('email', email).first()
          if (emailEmUso) {
            return {
              balde: 'rejeitados' as const,
              motivo: 'E-mail já cadastrado para outra pessoa.',
            }
          }

          const matriculaEmUso = await Matricula.query({ client: trx })
            .where('codigo', matriculaCodigo)
            .first()
          if (matriculaEmUso) {
            return {
              balde: 'rejeitados' as const,
              motivo: 'Matrícula já pertence a outro egresso.',
            }
          }

          const user = await User.create({ email, fullName: nomeCompleto }, { client: trx })
          const egresso = await Egresso.create(
            { userId: user.id, cpf, nomeCompleto, emailPessoal: email },
            { client: trx }
          )
          await Matricula.create(
            {
              codigo: matriculaCodigo,
              cursoId,
              egressoId: egresso.id,
              situacao,
              periodoFormatura,
            },
            { client: trx }
          )
          return { balde: 'novos' as const }
        })

        if (resultado.balde === 'novos') relatorio.novos++
        else if (resultado.balde === 'vinculados') relatorio.vinculados++
        else if (resultado.balde === 'atualizados') relatorio.atualizados++
        else if (resultado.balde === 'inalterados') relatorio.inalterados++
        else
          relatorio.rejeitados.push({
            linha: numeroLinha,
            motivo: resultado.motivo,
            nome: nomeCompleto,
            cpf,
          })
      } catch (error) {
        relatorio.rejeitados.push({
          linha: numeroLinha,
          motivo: traduzirErro(error),
          nome: nomeCompleto,
          cpf,
        })
      }
    }

    return relatorio
  }
}

function validarLinha(dados: Record<string, string>): string | null {
  const obrigatorios: { campo: string; rotulo: string }[] = [
    { campo: 'nomeCompleto', rotulo: 'nome completo' },
    { campo: 'email', rotulo: 'e-mail' },
    { campo: 'cpf', rotulo: 'CPF' },
    { campo: 'matriculaCodigo', rotulo: 'matrícula' },
    { campo: 'situacao', rotulo: 'situação' },
  ]
  for (const { campo, rotulo } of obrigatorios) {
    if (!dados[campo]?.trim()) return `Campo obrigatório vazio: ${rotulo}.`
  }
  if (dados.cpf.replace(/\D/g, '').length !== 11) {
    return 'CPF deve conter 11 dígitos.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) {
    return 'E-mail inválido.'
  }
  const situacao = dados.situacao.trim() as SituacaoMatricula
  if (!SITUACOES_MATRICULA.includes(situacao)) {
    return `Situação inválida (use: ${SITUACOES_MATRICULA.join(', ')}).`
  }
  return null
}

function traduzirErro(error: unknown): string {
  const mensagem = error instanceof Error ? error.message : String(error)
  if (/matriculas.*codigo/i.test(mensagem) && /unique/i.test(mensagem)) {
    return 'Código de matrícula já usado por outro registro.'
  }
  if (/egressos.*cpf/i.test(mensagem) && /unique/i.test(mensagem)) {
    return 'Conflito de CPF ao salvar a linha.'
  }
  return 'Erro inesperado ao salvar a linha.'
}
