import type { HttpContext } from '@adonisjs/core/http'
import ListarInstitutos from '#queries/listar_institutos'
import BuscarInstituto from '#queries/buscar_instituto'
import CriarInstituto from '#actions/criar_instituto'
import AtualizarInstituto from '#actions/atualizar_instituto'
import RemoverInstituto from '#actions/remover_instituto'
import {
  atualizarInstitutoValidator,
  criarInstitutoValidator,
  listarInstitutosValidator,
} from '#validators/admin'

export default class InstitutosController {
  async index({ inertia, request }: HttpContext) {
    const { q, page, perPage } = await request.validateUsing(listarInstitutosValidator)
    const resultado = await new ListarInstitutos().handle({
      q,
      page: page ?? 1,
      perPage: perPage ?? 20,
    })

    return inertia.render('admin/institutos', {
      institutos: { data: resultado.data, metadata: resultado.meta },
      filtros: { q: q ?? null },
    })
  }

  async show({ inertia, params, response }: HttpContext) {
    const id = Number(params.id)
    const instituto = await new BuscarInstituto().handle({ id })
    if (!instituto) return response.notFound()
    return inertia.render('admin/instituto_show', { instituto })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(criarInstitutoValidator)
    const resultado = await new CriarInstituto().handle(payload)

    if (resultado.status === 'criado') {
      session.flash('success', `Instituto ${resultado.instituto.nome} cadastrado.`)
      return response.redirect().toRoute('admin.institutos')
    }

    session.flashErrors({ codigo: 'Já existe um instituto com este código.' })
    return response.redirect().back()
  }

  async update({ params, request, response, session }: HttpContext) {
    const id = Number(params.id)
    const payload = await request.validateUsing(atualizarInstitutoValidator)
    const resultado = await new AtualizarInstituto().handle({ id, ...payload })

    if (resultado.status === 'atualizado') {
      session.flash('success', `Instituto ${resultado.instituto.nome} atualizado.`)
      return response.redirect().back()
    }

    if (resultado.status === 'codigo_em_uso') {
      session.flashErrors({ codigo: 'Já existe um instituto com este código.' })
      return response.redirect().back()
    }

    return response.notFound()
  }

  async destroy({ params, response, session }: HttpContext) {
    const id = Number(params.id)
    const resultado = await new RemoverInstituto().handle({ id })

    if (resultado.status === 'removido') {
      session.flash('success', 'Instituto removido.')
      return response.redirect().toRoute('admin.institutos')
    }

    if (resultado.status === 'tem_dependencias') {
      const partes: string[] = []
      if (resultado.cursos > 0) {
        partes.push(`${resultado.cursos} curso${resultado.cursos === 1 ? '' : 's'}`)
      }
      if (resultado.programas > 0) {
        partes.push(`${resultado.programas} programa${resultado.programas === 1 ? '' : 's'}`)
      }
      session.flash(
        'error',
        `Não foi possível remover: ${partes.join(' e ')} vinculado${
          resultado.cursos + resultado.programas === 1 ? '' : 's'
        }.`
      )
      return response.redirect().back()
    }

    return response.notFound()
  }
}
