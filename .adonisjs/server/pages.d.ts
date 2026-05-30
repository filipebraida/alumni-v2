import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'dashboard': ExtractProps<(typeof import('../../inertia/pages/dashboard.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'gestao/dashboard': ExtractProps<(typeof import('../../inertia/pages/gestao/dashboard.tsx'))['default']>
    'gestao/egressos': ExtractProps<(typeof import('../../inertia/pages/gestao/egressos.tsx'))['default']>
    'onboarding': ExtractProps<(typeof import('../../inertia/pages/onboarding.tsx'))['default']>
    'portal/egressos': ExtractProps<(typeof import('../../inertia/pages/portal/egressos.tsx'))['default']>
    'portal/entrada': ExtractProps<(typeof import('../../inertia/pages/portal/entrada.tsx'))['default']>
    'portal/sobre': ExtractProps<(typeof import('../../inertia/pages/portal/sobre.tsx'))['default']>
    'portal/transparencia': ExtractProps<(typeof import('../../inertia/pages/portal/transparencia.tsx'))['default']>
    'portal/ufrrj': ExtractProps<(typeof import('../../inertia/pages/portal/ufrrj.tsx'))['default']>
    'respostas/create': ExtractProps<(typeof import('../../inertia/pages/respostas/create.tsx'))['default']>
    'gestao/importacao_resultado': ExtractProps<(typeof import('../../inertia/pages/gestao/importacao_resultado.tsx'))['default']>
  }
}
