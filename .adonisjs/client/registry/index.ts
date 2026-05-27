/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
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
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
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
