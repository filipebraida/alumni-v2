import { readFile } from 'node:fs/promises'
import type { HttpContext } from '@adonisjs/core/http'

import ImportarEgressosDoCsv, {
  type ImportacaoEgressosRelatorio,
} from '#actions/importar_egressos_do_csv'
import { importarEgressosValidator } from '#validators/gestao'

type ImportacaoFlash = {
  relatorio: ImportacaoEgressosRelatorio
  cursoNome: string
  nomeArquivo: string | null
}

/**
 * Recebe o upload da planilha CSV de egressos para o curso ativo. O `store`
 * processa de forma síncrona, flasha o relatório e redireciona para o `show`
 * (PRG). Sem persistência: F5 na tela de resultado já não tem mais o flash e
 * cai de volta na listagem de egressos.
 */
export default class ImportacoesEgressosController {
  async store({ gestao, request, response, session }: HttpContext) {
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

    const flash: ImportacaoFlash = {
      relatorio,
      cursoNome: cursoAtivo.nome,
      nomeArquivo: arquivo.clientName ?? null,
    }
    session.flash('importacao', flash)
    return response.redirect().toRoute('gestao.egressos.importacoes.show')
  }

  async show({ inertia, response, session }: HttpContext) {
    const flash = session.flashMessages.get('importacao') as ImportacaoFlash | undefined
    if (!flash) {
      return response.redirect().toRoute('gestao.egressos')
    }
    return inertia.render('gestao/importacao_resultado', flash)
  }
}
