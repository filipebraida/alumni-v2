import { Lock } from 'lucide-react'

import { type Data } from '@generated/data'
import { cn } from '~/lib/utils'

type Perfil = Data.User.Variants['forPerfil']

type Item = {
  ativa: boolean
  titulo: string
  detalhe: string
}

/** Versão read-only das preferências de privacidade. */
export function PerfilPrivacidadeShow({ perfil }: { perfil: Perfil }) {
  const itens: Item[] = [
    {
      ativa: perfil.visEmail,
      titulo: 'Meu e-mail para colegas de turma',
      detalhe: 'A coordenação sempre tem acesso.',
    },
    {
      ativa: perfil.visMapa,
      titulo: 'Aparecer no mapa da turma',
      detalhe: 'Sua cidade/UF entra no mapa coletivo.',
    },
    {
      ativa: perfil.visEncontrar,
      titulo: 'Permitir que colegas me encontrem',
      detalhe: 'Aparece em sugestões de reconexão.',
    },
  ]

  return (
    <ul className="divide-y rounded-lg border">
      {itens.map((it) => (
        <PrivacidadeLinha key={it.titulo} {...it} />
      ))}
      <li className="flex items-center gap-3 bg-muted/30 px-4 py-3 text-muted-foreground">
        <Lock className="size-4 shrink-0" />
        <span className="text-sm">
          Faixa salarial sempre anônima — exibida apenas em médias agregadas (LGPD).
        </span>
      </li>
    </ul>
  )
}

function PrivacidadeLinha({ ativa, titulo, detalhe }: Item) {
  return (
    <li className="flex items-center gap-4 px-4 py-3.5">
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-xs',
          ativa ? 'bg-success/10 text-success-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        <span className="inline-block size-1.5 rounded-full bg-current" />
        {ativa ? 'visível' : 'oculto'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm">{titulo}</div>
        <div className="mt-0.5 text-muted-foreground text-xs">{detalhe}</div>
      </div>
    </li>
  )
}
