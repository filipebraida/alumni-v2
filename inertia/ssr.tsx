import { client } from '~/client'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { ThemeProvider } from '~/hooks/use_theme'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true })
      )
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <ThemeProvider>
            <App {...props} />
          </ThemeProvider>
        </TuyauProvider>
      )
    },
  })
}
