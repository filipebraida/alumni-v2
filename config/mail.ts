import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  /**
   * Which mailer to use. Dev points at local Mailpit over SMTP; production
   * switches to Resend by setting MAIL_DRIVER=resend + RESEND_API_KEY.
   */
  default: env.get('MAIL_DRIVER'),

  /**
   * The `from` address used for every email unless a mail class
   * overrides it. With Resend the domain must be verified in the account.
   */
  from: env.get('MAIL_FROM'),

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    /**
     * SMTP transport. In development this points at a local Mailpit instance
     * (see compose.yml) — no auth, no TLS. For a real authenticated server
     * (e.g. the UFRRJ institutional SMTP) set SMTP_USERNAME/PASSWORD/SECURE;
     * auth is only sent when a username is configured.
     */
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      secure: env.get('SMTP_SECURE') ?? false,
      auth: env.get('SMTP_USERNAME')
        ? {
            type: 'login',
            user: env.get('SMTP_USERNAME')!,
            pass: env.get('SMTP_PASSWORD') ?? '',
          }
        : undefined,
      tls: {
        rejectUnauthorized: env.get('SMTP_REJECTUNAUTHORIZED') ?? true,
      },
    }),

    /**
     * Resend transport for production. Uses the Resend HTTP API (no extra
     * package). The key is only required when MAIL_DRIVER=resend.
     */
    resend: transports.resend({
      key: env.get('RESEND_API_KEY') ?? '',
      baseUrl: 'https://api.resend.com',
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
