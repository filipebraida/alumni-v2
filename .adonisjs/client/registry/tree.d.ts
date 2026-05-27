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
  dashboard: typeof routes['dashboard']
}
