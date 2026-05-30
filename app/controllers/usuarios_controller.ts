import type { HttpContext } from '@adonisjs/core/http'
import ListarUsuarios from '#queries/listar_usuarios'
import ListarCursos from '#queries/listar_cursos'
import CriarUsuario from '#actions/criar_usuario'
import AtualizarUsuario from '#actions/atualizar_usuario'
import {
  atualizarUsuarioValidator,
  criarUsuarioValidator,
  listarUsuariosValidator,
} from '#validators/admin'

export default class UsuariosController {
  async index({ inertia, request }: HttpContext) {
    const { q, tipo, page, perPage } = await request.validateUsing(listarUsuariosValidator)
    const [usuarios, cursos] = await Promise.all([
      new ListarUsuarios().handle({ q, tipo, page: page ?? 1, perPage: perPage ?? 20 }),
      new ListarCursos().handle({ perPage: 200 }),
    ])
    return inertia.render('admin/usuarios', {
      usuarios: { data: usuarios.data, metadata: usuarios.meta },
      cursos: cursos.data,
      filtros: { q: q ?? null, tipo: tipo ?? null },
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(criarUsuarioValidator)
    const resultado = await new CriarUsuario().handle({
      email: payload.email,
      fullName: payload.fullName,
      role: payload.isAdmin ? 'admin' : 'usuario',
      cursosIds: payload.cursosIds ?? [],
    })

    if (resultado.status === 'criado') {
      session.flash('success', `${resultado.usuario.nome} cadastrado(a).`)
      return response.redirect().toRoute('admin.usuarios')
    }

    session.flashErrors({ email: 'Já existe um usuário com este e-mail.' })
    return response.redirect().back()
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) {
      session.flash('error', 'Usuário inválido.')
      return response.redirect().toRoute('admin.usuarios')
    }

    const payload = await request.validateUsing(atualizarUsuarioValidator)
    const novoRole = payload.isAdmin ? 'admin' : 'usuario'

    // Auto-proteção: não deixa o próprio admin se despromover por engano.
    if (auth.user?.id === id && auth.user.isAdmin && novoRole !== 'admin') {
      session.flash('error', 'Você não pode remover seu próprio acesso de administrador.')
      return response.redirect().back()
    }

    const resultado = await new AtualizarUsuario().handle({
      id,
      fullName: payload.fullName,
      role: novoRole,
      cursosIds: payload.cursosIds ?? [],
    })

    if (resultado.status === 'atualizado') {
      session.flash('success', `${resultado.usuario.nome} atualizado(a).`)
      return response.redirect().toRoute('admin.usuarios')
    }

    session.flash('error', 'Usuário não encontrado.')
    return response.redirect().toRoute('admin.usuarios')
  }
}
