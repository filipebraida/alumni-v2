/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import { loginCodeRequestThrottle, loginCodeVerifyThrottle } from '#start/limiter'

/*
| Public portal (institutional, pre-login). All pages share PortalLayout.
| "Portal de entrada" (login) is the site root; siblings hang off named routes.
*/
router.on('/').renderInertia('portal/entrada', {}).as('home')
router.on('/para-egressos').renderInertia('portal/egressos', {}).as('portal.egressos')
router.on('/sobre').renderInertia('portal/sobre', {}).as('portal.sobre')
router.on('/para-a-ufrrj').renderInertia('portal/ufrrj', {}).as('portal.ufrrj')
router.on('/transparencia').renderInertia('portal/transparencia', {}).as('portal.transparencia')

router
  .group(() => {
    // Passwordless login. The email step lives on the home page (`/`); after a
    // code is sent the user lands on the dedicated code page below.
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store']).use(loginCodeVerifyThrottle)

    router.post('login/code', [controllers.CodigoAcesso, 'store']).use(loginCodeRequestThrottle)
    router.delete('login/code', [controllers.CodigoAcesso, 'destroy'])
  })
  .use(middleware.guest())

// Logout: qualquer usuário autenticado (egresso ou gestor).
router.post('logout', [controllers.Session, 'destroy']).use(middleware.auth())

// Área do egresso. Exige autenticação + perfil de egresso (vínculo com matrícula).
router
  .group(() => {
    // Onboarding "É você?" — primeiro acesso (identidade + consentimento).
    router.get('onboarding', [controllers.Onboarding, 'show'])
    router.post('onboarding', [controllers.Onboarding, 'update'])

    router.get('/dashboard', [controllers.Dashboard, 'show']).as('dashboard')

    // Atualizar dados = criar uma nova foto da entidade Resposta (append-only).
    router.resource('respostas', controllers.Respostas).only(['create', 'store'])
  })
  .use([middleware.auth(), middleware.egresso()])

// Área de gestão (coordenação de curso). O `gestor` middleware exige o perfil
// de gestor e resolve o curso ativo (tenant) a partir da sessão.
router
  .group(() => {
    router.get('/gestao', [controllers.Gestao, 'show']).as('gestao.show')
    router.get('/gestao/egressos', [controllers.Egressos, 'index']).as('gestao.egressos')
    router
      .get('/gestao/egressos/lookup', [controllers.Egressos, 'lookup'])
      .as('gestao.egressos.lookup')
    router.post('/gestao/egressos', [controllers.Egressos, 'store']).as('gestao.egressos.store')
    router
      .post('/gestao/egressos/vinculos', [controllers.Egressos, 'vincular'])
      .as('gestao.egressos.vincular')
    router
      .get('/gestao/egressos/importacoes', [controllers.ImportacoesEgressos, 'show'])
      .as('gestao.egressos.importacoes.show')
    router
      .post('/gestao/egressos/importacoes', [controllers.ImportacoesEgressos, 'store'])
      .as('gestao.egressos.importacoes.store')
    // Show por último: rota com param só pega o que não casou nas literais acima.
    router
      .get('/gestao/egressos/:egressoId', [controllers.Egressos, 'show'])
      .where('egressoId', router.matchers.number())
      .as('gestao.egressos.show')
    router.put('/gestao/curso-ativo', [controllers.CursoAtivo, 'update']).as('gestao.curso_ativo')
  })
  .use([middleware.auth(), middleware.gestor()])

// Área administrativa, dentro do shell de gestão: `gestor` popula a shared
// prop `gestao` (admin tem bypass); `admin` corta quem não é admin.
router
  .group(() => {
    router.get('/admin/institutos', [controllers.Institutos, 'index']).as('admin.institutos')
    router
      .post('/admin/institutos', [controllers.Institutos, 'store'])
      .as('admin.institutos.store')
    router.get('/admin/cursos', [controllers.Cursos, 'index']).as('admin.cursos')
    router.post('/admin/cursos', [controllers.Cursos, 'store']).as('admin.cursos.store')
    router.get('/admin/usuarios', [controllers.Usuarios, 'index']).as('admin.usuarios')
    router.post('/admin/usuarios', [controllers.Usuarios, 'store']).as('admin.usuarios.store')
    router
      .put('/admin/usuarios/:id', [controllers.Usuarios, 'update'])
      .where('id', router.matchers.number())
      .as('admin.usuarios.update')
  })
  .use([middleware.auth(), middleware.gestor(), middleware.admin()])
