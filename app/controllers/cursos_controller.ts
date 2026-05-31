import type { HttpContext } from '@adonisjs/core/http'
import ListarCursos from '#queries/listar_cursos'
import ListarInstitutos from '#queries/listar_institutos'
import ListarProgramas from '#queries/listar_programas'
import CriarCurso from '#actions/criar_curso'
import { criarCursoValidator, listarCursosValidator } from '#validators/admin'

export default class CursosController {
  async index({ inertia, request }: HttpContext) {
    const { q, nivel, institutoId, page, perPage } =
      await request.validateUsing(listarCursosValidator)
    const [cursos, institutos, programas] = await Promise.all([
      new ListarCursos().handle({
        q,
        nivel,
        institutoId,
        page: page ?? 1,
        perPage: perPage ?? 20,
      }),
      new ListarInstitutos().handle({ perPage: 200 }),
      new ListarProgramas().handle({ ativo: true, perPage: 200 }),
    ])
    return inertia.render('admin/cursos', {
      cursos: { data: cursos.data, metadata: cursos.meta },
      institutos: institutos.data,
      programas: programas.data,
      filtros: {
        q: q ?? null,
        nivel: nivel ?? null,
        institutoId: institutoId ?? null,
      },
    })
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

    if (resultado.status === 'programa_obrigatorio') {
      session.flashErrors({ programaId: 'Selecione o programa de pós-graduação.' })
      return response.redirect().back()
    }

    if (resultado.status === 'programa_inexistente') {
      session.flashErrors({ programaId: 'Programa não encontrado.' })
      return response.redirect().back()
    }

    if (resultado.status === 'programa_de_outro_instituto') {
      session.flashErrors({ programaId: 'O programa pertence a outro instituto.' })
      return response.redirect().back()
    }

    if (resultado.status === 'graduacao_sem_programa') {
      session.flashErrors({ programaId: 'Cursos de graduação não usam programa.' })
      return response.redirect().back()
    }

    session.flashErrors({ institutoId: 'Instituto não encontrado.' })
    return response.redirect().back()
  }
}
