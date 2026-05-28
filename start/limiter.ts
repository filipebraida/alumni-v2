/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Throttles how often a code can be requested for a given client, limiting
 * email spam and brute-force seeding of codes.
 */
export const loginCodeRequestThrottle = limiter.define('login_code_request', (ctx) => {
  return limiter
    .allowRequests(10)
    .every('1 minute')
    .blockFor('5 mins')
    .usingKey(`login_code_req_${ctx.request.ip()}`)
})

/**
 * Throttles code verification attempts per client, complementing the
 * per-code attempt counter.
 */
export const loginCodeVerifyThrottle = limiter.define('login_code_verify', (ctx) => {
  return limiter
    .allowRequests(10)
    .every('15 minutes')
    .blockFor('15 mins')
    .usingKey(`login_code_verify_${ctx.request.ip()}`)
})
