import type { HttpContext } from '@adonisjs/core/http'
import ListarInstitutos from '#queries/listar_institutos'
import ListarProgramas from '#queries/listar_programas'
import BuscarPrograma from '#queries/buscar_programa'
import CriarPrograma from '#actions/criar_programa'
import AtualizarPrograma from '#actions/atualizar_programa'
import RemoverPrograma from '#actions/remover_programa'
import {
  atualizarProgramaValidator,
  criarProgramaValidator,
  listarProgramasValidator,
} from '#validators/admin'

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

  async show({ inertia, params, response }: HttpContext) {
    const id = Number(params.id)
    const programa = await new BuscarPrograma().handle({ id })
    if (!programa) return response.notFound()
    return inertia.render('admin/programa_show', { programa })
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

  async update({ params, request, response, session }: HttpContext) {
    const id = Number(params.id)
    const payload = await request.validateUsing(atualizarProgramaValidator)
    const resultado = await new AtualizarPrograma().handle({ id, ...payload })

    if (resultado.status === 'atualizado') {
      session.flash('success', `Programa ${resultado.programa.nome} atualizado.`)
      return response.redirect().back()
    }

    if (resultado.status === 'codigo_em_uso') {
      session.flashErrors({ codigo: 'Já existe um programa com este código.' })
      return response.redirect().back()
    }

    if (resultado.status === 'instituto_inexistente') {
      session.flashErrors({ institutoId: 'Instituto não encontrado.' })
      return response.redirect().back()
    }

    return response.notFound()
  }

  async destroy({ params, response, session }: HttpContext) {
    const id = Number(params.id)
    const resultado = await new RemoverPrograma().handle({ id })

    if (resultado.status === 'removido') {
      session.flash('success', 'Programa removido.')
      return response.redirect().toRoute('admin.programas')
    }

    if (resultado.status === 'tem_dependencias') {
      session.flash(
        'error',
        `Não foi possível remover: ${resultado.cursos} curso${
          resultado.cursos === 1 ? '' : 's'
        } vinculado${resultado.cursos === 1 ? '' : 's'}.`
      )
      return response.redirect().back()
    }

    return response.notFound()
  }
}
