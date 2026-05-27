import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'codigo_acesso.store': { paramsTuple?: []; params?: {} }
    'codigo_acesso.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'codigo_acesso.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'codigo_acesso.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}