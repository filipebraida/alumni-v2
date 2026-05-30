import type { HttpContext } from '@adonisjs/core/http'
import ListarInstitutos from '#queries/listar_institutos'
import CriarInstituto from '#actions/criar_instituto'
import { criarInstitutoValidator, listarInstitutosValidator } from '#validators/admin'

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
}
