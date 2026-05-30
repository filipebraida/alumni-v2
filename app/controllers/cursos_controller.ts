import type { HttpContext } from '@adonisjs/core/http'
import ListarCursos from '#queries/listar_cursos'
import ListarInstitutos from '#queries/listar_institutos'
import CriarCurso from '#actions/criar_curso'
import { criarCursoValidator } from '#validators/admin'

export default class CursosController {
  async index({ inertia }: HttpContext) {
    const [cursos, institutos] = await Promise.all([
      new ListarCursos().handle(),
      new ListarInstitutos().handle(),
    ])
    return inertia.render('admin/cursos', { cursos, institutos })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(criarCursoValidator)
    const resultado = await new CriarCurso().handle(payload)

    if (resultado.status === 'criado') {
      session.flash('success', `Curso ${resultado.curso.nome} cadastrado.`)
      return response.redirect().toRoute('admin.cursos')
    }

    if (resultado.status === 'codigo_em_uso') {
      session.flashErrors({ codigo: 'Já existe um curso com este código.' })
      return response.redirect().back()
    }

    session.flashErrors({ institutoId: 'Instituto não encontrado.' })
    return response.redirect().back()
  }
}
