/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
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
      importacoes: {
        show: typeof routes['gestao.egressos.importacoes.show']
        store: typeof routes['gestao.egressos.importacoes.store']
      }
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
  }
}
