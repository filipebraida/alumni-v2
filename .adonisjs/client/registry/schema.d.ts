/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'event_stream': {
    methods: ["GET","HEAD"]
    pattern: '/__transmit/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'subscribe': {
    methods: ["POST"]
    pattern: '/__transmit/subscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'unsubscribe': {
    methods: ["POST"]
    pattern: '/__transmit/unsubscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'portal.egressos': {
    methods: ["GET","HEAD"]
    pattern: '/para-egressos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'portal.sobre': {
    methods: ["GET","HEAD"]
    pattern: '/sobre'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'portal.ufrrj': {
    methods: ["GET","HEAD"]
    pattern: '/para-a-ufrrj'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'portal.transparencia': {
    methods: ["GET","HEAD"]
    pattern: '/transparencia'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').verificarCodigoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').verificarCodigoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'codigo_acesso.store': {
    methods: ["POST"]
    pattern: '/login/code'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').solicitarCodigoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').solicitarCodigoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/codigo_acesso_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/codigo_acesso_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'codigo_acesso.destroy': {
    methods: ["DELETE"]
    pattern: '/login/code'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/codigo_acesso_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/codigo_acesso_controller').default['destroy']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'notificacoes.index': {
    methods: ["GET","HEAD"]
    pattern: '/notificacoes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['index']>>>
    }
  }
  'notificacoes.visualizar': {
    methods: ["POST"]
    pattern: '/notificacoes/visualizar'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['visualizar']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['visualizar']>>>
    }
  }
  'notificacoes.ler_todas': {
    methods: ["POST"]
    pattern: '/notificacoes/ler-todas'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['lerTodas']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['lerTodas']>>>
    }
  }
  'notificacoes.ler': {
    methods: ["POST"]
    pattern: '/notificacoes/:id/ler'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['ler']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/notificacoes_controller').default['ler']>>>
    }
  }
  'onboarding.show': {
    methods: ["GET","HEAD"]
    pattern: '/onboarding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['show']>>>
    }
  }
  'onboarding.update': {
    methods: ["POST"]
    pattern: '/onboarding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/onboarding_controller').default['update']>>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['show']>>>
    }
  }
  'respostas.create': {
    methods: ["GET","HEAD"]
    pattern: '/respostas/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/respostas_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/respostas_controller').default['create']>>>
    }
  }
  'respostas.store': {
    methods: ["POST"]
    pattern: '/respostas'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/resposta').registrarRespostaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/resposta').registrarRespostaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/respostas_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/respostas_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.show': {
    methods: ["GET","HEAD"]
    pattern: '/gestao'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/gestao_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/gestao_controller').default['show']>>>
    }
  }
  'gestao.egressos': {
    methods: ["GET","HEAD"]
    pattern: '/gestao/egressos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/gestao').listarEgressosValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.egressos.lookup': {
    methods: ["GET","HEAD"]
    pattern: '/gestao/egressos/lookup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/gestao').lookupEgressoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['lookup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['lookup']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.egressos.store': {
    methods: ["POST"]
    pattern: '/gestao/egressos'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gestao').cadastrarEgressoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gestao').cadastrarEgressoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.egressos.vincular': {
    methods: ["POST"]
    pattern: '/gestao/egressos/vinculos'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gestao').vincularEgressoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gestao').vincularEgressoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['vincular']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['vincular']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.egressos.importacoes.show': {
    methods: ["GET","HEAD"]
    pattern: '/gestao/egressos/importacoes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/importacoes_egressos_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/importacoes_egressos_controller').default['show']>>>
    }
  }
  'gestao.egressos.importacoes.store': {
    methods: ["POST"]
    pattern: '/gestao/egressos/importacoes'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gestao').importarEgressosValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gestao').importarEgressosValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/importacoes_egressos_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/importacoes_egressos_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.egressos.show': {
    methods: ["GET","HEAD"]
    pattern: '/gestao/egressos/:egressoId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { egressoId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/gestao').mostrarEgressoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/egressos_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'gestao.curso_ativo': {
    methods: ["PUT"]
    pattern: '/gestao/curso-ativo'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gestao').trocarCursoAtivoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gestao').trocarCursoAtivoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/curso_ativo_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/curso_ativo_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.institutos': {
    methods: ["GET","HEAD"]
    pattern: '/admin/institutos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/admin').listarInstitutosValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/institutos_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/institutos_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.institutos.store': {
    methods: ["POST"]
    pattern: '/admin/institutos'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').criarInstitutoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').criarInstitutoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/institutos_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/institutos_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.cursos': {
    methods: ["GET","HEAD"]
    pattern: '/admin/cursos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/admin').listarCursosValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cursos_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cursos_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.cursos.store': {
    methods: ["POST"]
    pattern: '/admin/cursos'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').criarCursoValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').criarCursoValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cursos_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cursos_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.usuarios': {
    methods: ["GET","HEAD"]
    pattern: '/admin/usuarios'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/admin').listarUsuariosValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.usuarios.store': {
    methods: ["POST"]
    pattern: '/admin/usuarios'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').criarUsuarioValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').criarUsuarioValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.usuarios.update': {
    methods: ["PUT"]
    pattern: '/admin/usuarios/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin').atualizarUsuarioValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin').atualizarUsuarioValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/usuarios_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
