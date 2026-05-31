import type { HttpContext } from '@adonisjs/core/http'
import ListarInstitutos from '#queries/listar_institutos'
import ListarProgramas from '#queries/listar_programas'
import CriarPrograma from '#actions/criar_programa'
import { criarProgramaValidator, listarProgramasValidator } from '#validators/admin'

export default class ProgramasController {
  async index({ inertia, request }: HttpContext) {
    const { q, institutoId, page, perPage } =
      await request.validateUsing(listarProgramasValidator)
    const [programas, institutos] = await Promise.all([
      new ListarProgramas().handle({
        q,
        institutoId,
        page: page ?? 1,
        perPage: perPage ?? 20,
      }),
      new ListarInstitutos().handle({ perPage: 200 }),
    ])
    return inertia.render('admin/programas', {
      programas: { data: programas.data, metadata: programas.meta },
      institutos: institutos.data,
      filtros: {
        q: q ?? null,
        institutoId: institutoId ?? null,
      },
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(criarProgramaValidator)
    const resultado = await new CriarPrograma().handle(payload)

    if (resultado.status === 'criado') {
      session.flash('success', `Programa ${resultado.programa.nome} cadastrado.`)
      return response.redirect().toRoute('admin.programas')
    }

    if (resultado.status === 'codigo_em_uso') {
      session.flashErrors({ codigo: 'Já existe um programa com este código.' })
      return response.redirect().back()
    }

    session.flashErrors({ institutoId: 'Instituto não encontrado.' })
    return response.redirect().back()
  }
}
