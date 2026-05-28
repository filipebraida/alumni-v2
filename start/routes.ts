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

router
  .group(() => {
    // Onboarding "É você?" — primeiro acesso (identidade + consentimento).
    router.get('onboarding', [controllers.Onboarding, 'show'])
    router.post('onboarding', [controllers.Onboarding, 'update'])

    router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
