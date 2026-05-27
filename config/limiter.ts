import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/limiter'

const limiterConfig = defineConfig({
  default: env.get('LIMITER_STORE'),
  stores: {
    /**
     * Database store persists rate-limiting data in the app database
     * (the `rate_limits` table).
     */
    database: stores.database({
      tableName: 'rate_limits',
    }),

    /**
     * Memory store. Useful during testing.
     */
    memory: stores.memory({}),
  },
})

export default limiterConfig

declare module '@adonisjs/limiter/types' {
  export interface LimitersList extends InferLimiters<typeof limiterConfig> {}
}
