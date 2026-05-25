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
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
}
