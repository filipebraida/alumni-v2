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
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
