import type { HttpContext } from '@adonisjs/core/http'
import ListarCursos from '#queries/listar_cursos'
import ListarInstitutos from '#queries/listar_institutos'
import ListarProgramas from '#queries/listar_programas'
import BuscarCurso from '#queries/buscar_curso'
import CriarCurso from '#actions/criar_curso'
import AtualizarCurso from '#actions/atualizar_curso'
import RemoverCurso from '#actions/remover_curso'
import {
  atualizarCursoValidator,
  criarCursoValidator,
  listarCursosValidator,
} from '#validators/admin'

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

  async show({ inertia, params, response }: HttpContext) {
    const id = Number(params.id)
    const curso = await new BuscarCurso().handle({ id })
    if (!curso) return response.notFound()
    return inertia.render('admin/curso_show', { curso })
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

  async update({ params, request, response, session }: HttpContext) {
    const id = Number(params.id)
    const payload = await request.validateUsing(atualizarCursoValidator)
    const resultado = await new AtualizarCurso().handle({ id, ...payload })

    if (resultado.status === 'atualizado') {
      session.flash('success', `Curso ${resultado.curso.nome} atualizado.`)
      return response.redirect().back()
    }

    if (resultado.status === 'codigo_em_uso') {
      session.flashErrors({ codigo: 'Já existe um curso com este código.' })
      return response.redirect().back()
    }

    if (resultado.status === 'instituto_inexistente') {
      session.flashErrors({ institutoId: 'Instituto não encontrado.' })
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

    return response.notFound()
  }

  async destroy({ params, response, session }: HttpContext) {
    const id = Number(params.id)
    const resultado = await new RemoverCurso().handle({ id })

    if (resultado.status === 'removido') {
      session.flash('success', 'Curso removido.')
      return response.redirect().toRoute('admin.cursos')
    }

    if (resultado.status === 'tem_dependencias') {
      const partes: string[] = []
      if (resultado.matriculas > 0) {
        partes.push(
          `${resultado.matriculas} matrícula${resultado.matriculas === 1 ? '' : 's'}`
        )
      }
      if (resultado.coordenadores > 0) {
        partes.push(
          `${resultado.coordenadores} coordenador${resultado.coordenadores === 1 ? '' : 'es'}`
        )
      }
      session.flash('error', `Não foi possível remover: ${partes.join(' e ')} vinculado(s).`)
      return response.redirect().back()
    }

    return response.notFound()
  }
}
