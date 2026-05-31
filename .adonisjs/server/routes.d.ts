import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'event_stream': { paramsTuple?: []; params?: {} }
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
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
    'notificacoes.index': { paramsTuple?: []; params?: {} }
    'notificacoes.visualizar': { paramsTuple?: []; params?: {} }
    'notificacoes.ler_todas': { paramsTuple?: []; params?: {} }
    'notificacoes.ler': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'perfil.show': { paramsTuple?: []; params?: {} }
    'perfil.edit': { paramsTuple?: []; params?: {} }
    'perfil.update': { paramsTuple?: []; params?: {} }
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
    'gestao.egressos.pedir_atualizacao': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.show': { paramsTuple: [ParamValue]; params: {'egressoId': ParamValue} }
    'gestao.curso_ativo': { paramsTuple?: []; params?: {} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.institutos.store': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
    'admin.cursos.store': { paramsTuple?: []; params?: {} }
    'admin.usuarios': { paramsTuple?: []; params?: {} }
    'admin.usuarios.store': { paramsTuple?: []; params?: {} }
    'admin.usuarios.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'event_stream': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'notificacoes.index': { paramsTuple?: []; params?: {} }
    'perfil.show': { paramsTuple?: []; params?: {} }
    'perfil.edit': { paramsTuple?: []; params?: {} }
    'onboarding.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'respostas.create': { paramsTuple?: []; params?: {} }
    'gestao.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos': { paramsTuple?: []; params?: {} }
    'gestao.egressos.lookup': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos.show': { paramsTuple: [ParamValue]; params: {'egressoId': ParamValue} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
    'admin.usuarios': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'event_stream': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'portal.egressos': { paramsTuple?: []; params?: {} }
    'portal.sobre': { paramsTuple?: []; params?: {} }
    'portal.ufrrj': { paramsTuple?: []; params?: {} }
    'portal.transparencia': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'notificacoes.index': { paramsTuple?: []; params?: {} }
    'perfil.show': { paramsTuple?: []; params?: {} }
    'perfil.edit': { paramsTuple?: []; params?: {} }
    'onboarding.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'respostas.create': { paramsTuple?: []; params?: {} }
    'gestao.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos': { paramsTuple?: []; params?: {} }
    'gestao.egressos.lookup': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.show': { paramsTuple?: []; params?: {} }
    'gestao.egressos.show': { paramsTuple: [ParamValue]; params: {'egressoId': ParamValue} }
    'admin.institutos': { paramsTuple?: []; params?: {} }
    'admin.cursos': { paramsTuple?: []; params?: {} }
    'admin.usuarios': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'subscribe': { paramsTuple?: []; params?: {} }
    'unsubscribe': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'codigo_acesso.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'notificacoes.visualizar': { paramsTuple?: []; params?: {} }
    'notificacoes.ler_todas': { paramsTuple?: []; params?: {} }
    'notificacoes.ler': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'onboarding.update': { paramsTuple?: []; params?: {} }
    'respostas.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.store': { paramsTuple?: []; params?: {} }
    'gestao.egressos.vincular': { paramsTuple?: []; params?: {} }
    'gestao.egressos.pedir_atualizacao': { paramsTuple?: []; params?: {} }
    'gestao.egressos.importacoes.store': { paramsTuple?: []; params?: {} }
    'admin.institutos.store': { paramsTuple?: []; params?: {} }
    'admin.cursos.store': { paramsTuple?: []; params?: {} }
    'admin.usuarios.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'codigo_acesso.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'perfil.update': { paramsTuple?: []; params?: {} }
    'gestao.curso_ativo': { paramsTuple?: []; params?: {} }
    'admin.usuarios.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}