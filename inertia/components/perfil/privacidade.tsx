import { Lock } from 'lucide-react'

import { Switch } from '~/components/ui/switch'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/use_perfil_form'

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
}

type Toggle = {
  key: 'visEmail' | 'visMapa' | 'visEncontrar'
  label: string
  hint: string
}

const TOGGLES: Toggle[] = [
  {
    key: 'visEmail',
    label: 'Mostrar meu e-mail para colegas de turma',
    hint: 'A coordenação sempre tem acesso.',
  },
  {
    key: 'visMapa',
    label: 'Aparecer no mapa da turma',
    hint: 'Sua cidade/UF entra no mapa coletivo.',
  },
  {
    key: 'visEncontrar',
    label: 'Permitir que colegas me encontrem',
    hint: 'Aparece em sugestões de reconexão.',
  },
]

/**
 * Seção "Privacidade": toggles do que é compartilhado com colegas. A faixa
 * salarial é trava LGPD — sempre anônima, nem o egresso pode mudar.
 */
export function PerfilPrivacidade({ form, set }: Props) {
  return (
    <PerfilSectionCard
      id="privacidade"
      icon={Lock}
      title="Privacidade"
      description="Você controla o que é compartilhado com colegas."
    >
      <div className="divide-y rounded-lg border">
        {TOGGLES.map((t) => (
          <label key={t.key} className="flex cursor-pointer items-center gap-4 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm">{t.label}</div>
              <div className="mt-0.5 text-muted-foreground text-xs">{t.hint}</div>
            </div>
            <Switch checked={form[t.key]} onCheckedChange={(v) => set(t.key, v)} />
          </label>
        ))}
        <div className="flex items-center gap-4 bg-muted/30 px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-sm">
              <Lock className="size-3.5" /> Faixa salarial sempre anônima
            </div>
            <div className="mt-0.5 text-muted-foreground text-xs">
              Exibida apenas em médias agregadas (LGPD). Não pode ser desativado.
            </div>
          </div>
          <Switch checked disabled />
        </div>
      </div>
    </PerfilSectionCard>
  )
}
