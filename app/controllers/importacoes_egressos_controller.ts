import { readFile } from 'node:fs/promises'
import type { HttpContext } from '@adonisjs/core/http'

import ImportarEgressosDoCsv from '#actions/importar_egressos_do_csv'
import { importarEgressosValidator } from '#validators/gestao'

/**
 * Recebe o upload da planilha CSV de egressos para o curso ativo. Processa
 * de forma síncrona e renderiza direto a tela de resultado — sem flash, sem
 * banco, sem histórico. O relatório vive enquanto a página estiver aberta.
 */
export default class ImportacoesEgressosController {
  async store({ gestao, inertia, request, response, session }: HttpContext) {
    const { cursoAtivo } = gestao
    if (!cursoAtivo) {
      session.flash('error', 'Selecione um curso antes de importar a planilha.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const { arquivo } = await request.validateUsing(importarEgressosValidator)
    if (!arquivo.tmpPath) {
      session.flash('error', 'Não foi possível ler o arquivo enviado.')
      return response.redirect().toRoute('gestao.egressos')
    }

    const conteudo = await readFile(arquivo.tmpPath, 'utf-8')
    const relatorio = await new ImportarEgressosDoCsv().handle({
      cursoId: cursoAtivo.id,
      conteudo,
    })

    return inertia.render('gestao/importacao_resultado', {
      relatorio,
      cursoNome: cursoAtivo.nome,
      nomeArquivo: arquivo.clientName ?? null,
    })
  }
}
