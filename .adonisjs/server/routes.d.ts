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
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.show': { paramsTuple?: []; params?: {} }
    'onboarding.update': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'respostas.create': { paramsTuple?: []; params?: {} }
    'respostas.store': { paramsTuple?: []; params?: {} }
    'gestao.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos': { paramsTuple?: []; params?: {} }
    'gestao.egressos.lookup': { paramsTuple?: []; params?: {} }
    'gestao.egressos.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.vincular': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.store': { paramsTuple?: []; params?: {} }
    'gestao.curso_ativo': { paramsTuple?: []; params?: {} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.institutos.store': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
    'admin.cursos.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'onboarding.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'respostas.create': { paramsTuple?: []; params?: {} }
    'gestao.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos': { paramsTuple?: []; params?: {} }
    'gestao.egressos.lookup': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'onboarding.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'respostas.create': { paramsTuple?: []; params?: {} }
    'gestao.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos': { paramsTuple?: []; params?: {} }
    'gestao.egressos.lookup': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'codigo_acesso.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'onboarding.update': { paramsTuple?: []; params?: {} }
    'respostas.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.vincular': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.store': { paramsTuple?: []; params?: {} }
    'admin.institutos.store': { paramsTuple?: []; params?: {} }
    'admin.cursos.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'codigo_acesso.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'gestao.curso_ativo': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}