/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  eventStream: typeof routes['event_stream']
  subscribe: typeof routes['subscribe']
  unsubscribe: typeof routes['unsubscribe']
  home: typeof routes['home']
  portal: {
    egressos: typeof routes['portal.egressos']
    sobre: typeof routes['portal.sobre']
    ufrrj: typeof routes['portal.ufrrj']
    transparencia: typeof routes['portal.transparencia']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  codigoAcesso: {
    store: typeof routes['codigo_acesso.store']
    destroy: typeof routes['codigo_acesso.destroy']
  }
  notificacoes: {
    index: typeof routes['notificacoes.index']
    visualizar: typeof routes['notificacoes.visualizar']
    lerTodas: typeof routes['notificacoes.ler_todas']
    ler: typeof routes['notificacoes.ler']
  }
  perfil: {
    show: typeof routes['perfil.show']
    edit: typeof routes['perfil.edit']
    update: typeof routes['perfil.update']
  }
  onboarding: {
    show: typeof routes['onboarding.show']
    update: typeof routes['onboarding.update']
  }
  dashboard: typeof routes['dashboard']
  respostas: {
    create: typeof routes['respostas.create']
    store: typeof routes['respostas.store']
  }
  gestao: {
    show: typeof routes['gestao.show']
    egressos: typeof routes['gestao.egressos'] & {
      lookup: typeof routes['gestao.egressos.lookup']
      store: typeof routes['gestao.egressos.store']
      vincular: typeof routes['gestao.egressos.vincular']
      pedirAtualizacao: typeof routes['gestao.egressos.pedir_atualizacao']
      importacoes: {
        show: typeof routes['gestao.egressos.importacoes.show']
        store: typeof routes['gestao.egressos.importacoes.store']
      }
      show: typeof routes['gestao.egressos.show']
    }
    cursoAtivo: typeof routes['gestao.curso_ativo']
  }
  admin: {
    institutos: typeof routes['admin.institutos'] & {
      store: typeof routes['admin.institutos.store']
    }
    cursos: typeof routes['admin.cursos'] & {
      store: typeof routes['admin.cursos.store']
    }
    usuarios: typeof routes['admin.usuarios'] & {
      store: typeof routes['admin.usuarios.store']
      update: typeof routes['admin.usuarios.update']
    }
  }
}
