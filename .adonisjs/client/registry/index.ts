/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'event_stream': {
    methods: ["GET","HEAD"],
    pattern: '/__transmit/events',
    tokens: [{"old":"/__transmit/events","type":0,"val":"__transmit","end":""},{"old":"/__transmit/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['event_stream']['types'],
  },
  'subscribe': {
    methods: ["POST"],
    pattern: '/__transmit/subscribe',
    tokens: [{"old":"/__transmit/subscribe","type":0,"val":"__transmit","end":""},{"old":"/__transmit/subscribe","type":0,"val":"subscribe","end":""}],
    types: placeholder as Registry['subscribe']['types'],
  },
  'unsubscribe': {
    methods: ["POST"],
    pattern: '/__transmit/unsubscribe',
    tokens: [{"old":"/__transmit/unsubscribe","type":0,"val":"__transmit","end":""},{"old":"/__transmit/unsubscribe","type":0,"val":"unsubscribe","end":""}],
    types: placeholder as Registry['unsubscribe']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'portal.egressos': {
    methods: ["GET","HEAD"],
    pattern: '/para-egressos',
    tokens: [{"old":"/para-egressos","type":0,"val":"para-egressos","end":""}],
    types: placeholder as Registry['portal.egressos']['types'],
  },
  'portal.sobre': {
    methods: ["GET","HEAD"],
    pattern: '/sobre',
    tokens: [{"old":"/sobre","type":0,"val":"sobre","end":""}],
    types: placeholder as Registry['portal.sobre']['types'],
  },
  'portal.ufrrj': {
    methods: ["GET","HEAD"],
    pattern: '/para-a-ufrrj',
    tokens: [{"old":"/para-a-ufrrj","type":0,"val":"para-a-ufrrj","end":""}],
    types: placeholder as Registry['portal.ufrrj']['types'],
  },
  'portal.transparencia': {
    methods: ["GET","HEAD"],
    pattern: '/transparencia',
    tokens: [{"old":"/transparencia","type":0,"val":"transparencia","end":""}],
    types: placeholder as Registry['portal.transparencia']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'codigo_acesso.store': {
    methods: ["POST"],
    pattern: '/login/code',
    tokens: [{"old":"/login/code","type":0,"val":"login","end":""},{"old":"/login/code","type":0,"val":"code","end":""}],
    types: placeholder as Registry['codigo_acesso.store']['types'],
  },
  'codigo_acesso.destroy': {
    methods: ["DELETE"],
    pattern: '/login/code',
    tokens: [{"old":"/login/code","type":0,"val":"login","end":""},{"old":"/login/code","type":0,"val":"code","end":""}],
    types: placeholder as Registry['codigo_acesso.destroy']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'notificacoes.index': {
    methods: ["GET","HEAD"],
    pattern: '/notificacoes',
    tokens: [{"old":"/notificacoes","type":0,"val":"notificacoes","end":""}],
    types: placeholder as Registry['notificacoes.index']['types'],
  },
  'notificacoes.visualizar': {
    methods: ["POST"],
    pattern: '/notificacoes/visualizar',
    tokens: [{"old":"/notificacoes/visualizar","type":0,"val":"notificacoes","end":""},{"old":"/notificacoes/visualizar","type":0,"val":"visualizar","end":""}],
    types: placeholder as Registry['notificacoes.visualizar']['types'],
  },
  'notificacoes.ler_todas': {
    methods: ["POST"],
    pattern: '/notificacoes/ler-todas',
    tokens: [{"old":"/notificacoes/ler-todas","type":0,"val":"notificacoes","end":""},{"old":"/notificacoes/ler-todas","type":0,"val":"ler-todas","end":""}],
    types: placeholder as Registry['notificacoes.ler_todas']['types'],
  },
  'notificacoes.ler': {
    methods: ["POST"],
    pattern: '/notificacoes/:id/ler',
    tokens: [{"old":"/notificacoes/:id/ler","type":0,"val":"notificacoes","end":""},{"old":"/notificacoes/:id/ler","type":1,"val":"id","end":""},{"old":"/notificacoes/:id/ler","type":0,"val":"ler","end":""}],
    types: placeholder as Registry['notificacoes.ler']['types'],
  },
  'onboarding.show': {
    methods: ["GET","HEAD"],
    pattern: '/onboarding',
    tokens: [{"old":"/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['onboarding.show']['types'],
  },
  'onboarding.update': {
    methods: ["POST"],
    pattern: '/onboarding',
    tokens: [{"old":"/onboarding","type":0,"val":"onboarding","end":""}],
    types: placeholder as Registry['onboarding.update']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'respostas.create': {
    methods: ["GET","HEAD"],
    pattern: '/respostas/create',
    tokens: [{"old":"/respostas/create","type":0,"val":"respostas","end":""},{"old":"/respostas/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['respostas.create']['types'],
  },
  'respostas.store': {
    methods: ["POST"],
    pattern: '/respostas',
    tokens: [{"old":"/respostas","type":0,"val":"respostas","end":""}],
    types: placeholder as Registry['respostas.store']['types'],
  },
  'gestao.show': {
    methods: ["GET","HEAD"],
    pattern: '/gestao',
    tokens: [{"old":"/gestao","type":0,"val":"gestao","end":""}],
    types: placeholder as Registry['gestao.show']['types'],
  },
  'gestao.egressos': {
    methods: ["GET","HEAD"],
    pattern: '/gestao/egressos',
    tokens: [{"old":"/gestao/egressos","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos","type":0,"val":"egressos","end":""}],
    types: placeholder as Registry['gestao.egressos']['types'],
  },
  'gestao.egressos.lookup': {
    methods: ["GET","HEAD"],
    pattern: '/gestao/egressos/lookup',
    tokens: [{"old":"/gestao/egressos/lookup","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/lookup","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/lookup","type":0,"val":"lookup","end":""}],
    types: placeholder as Registry['gestao.egressos.lookup']['types'],
  },
  'gestao.egressos.store': {
    methods: ["POST"],
    pattern: '/gestao/egressos',
    tokens: [{"old":"/gestao/egressos","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos","type":0,"val":"egressos","end":""}],
    types: placeholder as Registry['gestao.egressos.store']['types'],
  },
  'gestao.egressos.vincular': {
    methods: ["POST"],
    pattern: '/gestao/egressos/vinculos',
    tokens: [{"old":"/gestao/egressos/vinculos","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/vinculos","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/vinculos","type":0,"val":"vinculos","end":""}],
    types: placeholder as Registry['gestao.egressos.vincular']['types'],
  },
  'gestao.egressos.pedir_atualizacao': {
    methods: ["POST"],
    pattern: '/gestao/egressos/pedidos-atualizacao',
    tokens: [{"old":"/gestao/egressos/pedidos-atualizacao","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/pedidos-atualizacao","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/pedidos-atualizacao","type":0,"val":"pedidos-atualizacao","end":""}],
    types: placeholder as Registry['gestao.egressos.pedir_atualizacao']['types'],
  },
  'gestao.egressos.importacoes.show': {
    methods: ["GET","HEAD"],
    pattern: '/gestao/egressos/importacoes',
    tokens: [{"old":"/gestao/egressos/importacoes","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/importacoes","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/importacoes","type":0,"val":"importacoes","end":""}],
    types: placeholder as Registry['gestao.egressos.importacoes.show']['types'],
  },
  'gestao.egressos.importacoes.store': {
    methods: ["POST"],
    pattern: '/gestao/egressos/importacoes',
    tokens: [{"old":"/gestao/egressos/importacoes","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/importacoes","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/importacoes","type":0,"val":"importacoes","end":""}],
    types: placeholder as Registry['gestao.egressos.importacoes.store']['types'],
  },
  'gestao.egressos.show': {
    methods: ["GET","HEAD"],
    pattern: '/gestao/egressos/:egressoId',
    tokens: [{"old":"/gestao/egressos/:egressoId","type":0,"val":"gestao","end":""},{"old":"/gestao/egressos/:egressoId","type":0,"val":"egressos","end":""},{"old":"/gestao/egressos/:egressoId","type":1,"val":"egressoId","end":""}],
    types: placeholder as Registry['gestao.egressos.show']['types'],
  },
  'gestao.curso_ativo': {
    methods: ["PUT"],
    pattern: '/gestao/curso-ativo',
    tokens: [{"old":"/gestao/curso-ativo","type":0,"val":"gestao","end":""},{"old":"/gestao/curso-ativo","type":0,"val":"curso-ativo","end":""}],
    types: placeholder as Registry['gestao.curso_ativo']['types'],
  },
  'admin.institutos': {
    methods: ["GET","HEAD"],
    pattern: '/admin/institutos',
    tokens: [{"old":"/admin/institutos","type":0,"val":"admin","end":""},{"old":"/admin/institutos","type":0,"val":"institutos","end":""}],
    types: placeholder as Registry['admin.institutos']['types'],
  },
  'admin.institutos.store': {
    methods: ["POST"],
    pattern: '/admin/institutos',
    tokens: [{"old":"/admin/institutos","type":0,"val":"admin","end":""},{"old":"/admin/institutos","type":0,"val":"institutos","end":""}],
    types: placeholder as Registry['admin.institutos.store']['types'],
  },
  'admin.cursos': {
    methods: ["GET","HEAD"],
    pattern: '/admin/cursos',
    tokens: [{"old":"/admin/cursos","type":0,"val":"admin","end":""},{"old":"/admin/cursos","type":0,"val":"cursos","end":""}],
    types: placeholder as Registry['admin.cursos']['types'],
  },
  'admin.cursos.store': {
    methods: ["POST"],
    pattern: '/admin/cursos',
    tokens: [{"old":"/admin/cursos","type":0,"val":"admin","end":""},{"old":"/admin/cursos","type":0,"val":"cursos","end":""}],
    types: placeholder as Registry['admin.cursos.store']['types'],
  },
  'admin.usuarios': {
    methods: ["GET","HEAD"],
    pattern: '/admin/usuarios',
    tokens: [{"old":"/admin/usuarios","type":0,"val":"admin","end":""},{"old":"/admin/usuarios","type":0,"val":"usuarios","end":""}],
    types: placeholder as Registry['admin.usuarios']['types'],
  },
  'admin.usuarios.store': {
    methods: ["POST"],
    pattern: '/admin/usuarios',
    tokens: [{"old":"/admin/usuarios","type":0,"val":"admin","end":""},{"old":"/admin/usuarios","type":0,"val":"usuarios","end":""}],
    types: placeholder as Registry['admin.usuarios.store']['types'],
  },
  'admin.usuarios.update': {
    methods: ["PUT"],
    pattern: '/admin/usuarios/:id',
    tokens: [{"old":"/admin/usuarios/:id","type":0,"val":"admin","end":""},{"old":"/admin/usuarios/:id","type":0,"val":"usuarios","end":""},{"old":"/admin/usuarios/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.usuarios.update']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
