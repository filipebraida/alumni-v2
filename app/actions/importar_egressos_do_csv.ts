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

export type LinhaComErro = {
  linha: number
  motivo: string
  nome?: string
  cpf?: string
}

export type ImportacaoEgressosRelatorio = {
  total: number
  criados: number
  vinculados: number
  jaNoCurso: number
  erros: LinhaComErro[]
}

/**
 * Importa egressos de uma planilha CSV para o roster do curso. Política do CPF:
 *  - CPF inexistente → cria User + Egresso + Matricula.
 *  - CPF já cadastrado e fora do curso → cria só a Matricula (não toca no
 *    cadastro existente).
 *  - CPF já cadastrado e no curso → não faz nada e reporta `ja_no_curso`.
 * Cada linha roda em sua própria transação; uma linha quebrada não desfaz as
 * outras. O retorno descreve o que entrou, o que foi vinculado e o que falhou.
 */
export default class ImportarEgressosDoCsv {
  async handle({
    cursoId,
    conteudo,
  }: ImportarEgressosDoCsvInput): Promise<ImportacaoEgressosRelatorio> {
    const relatorio: ImportacaoEgressosRelatorio = {
      total: 0,
      criados: 0,
      vinculados: 0,
      jaNoCurso: 0,
      erros: [],
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
      relatorio.erros.push({ linha: 0, motivo: 'CSV inválido ou mal formatado.' })
      return relatorio
    }

    relatorio.total = registros.length

    for (const [indice, dados] of registros.entries()) {
      // Header é a linha 1 do arquivo, então o índice 0 corresponde à linha 2.
      const numeroLinha = indice + 2
      const erroValidacao = validarLinha(dados)
      if (erroValidacao) {
        relatorio.erros.push({
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
        const status = await db.transaction(async (trx) => {
          const egressoExistente = await Egresso.findBy('cpf', cpf, { client: trx })

          if (egressoExistente) {
            const jaMatriculado = await Matricula.query({ client: trx })
              .where('egressoId', egressoExistente.id)
              .where('cursoId', cursoId)
              .first()
            if (jaMatriculado) return 'ja_no_curso' as const

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
            return 'vinculado' as const
          }

          const user = await User.updateOrCreate(
            { email },
            { email, fullName: nomeCompleto },
            { client: trx }
          )
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
          return 'criado' as const
        })

        if (status === 'criado') relatorio.criados++
        else if (status === 'vinculado') relatorio.vinculados++
        else relatorio.jaNoCurso++
      } catch (error) {
        relatorio.erros.push({
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
