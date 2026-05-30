import { Check, Mail } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/types'

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
  emailLogin: string
}

/**
 * Seção "Contato e localização": e-mail institucional read-only (linkado ao
 * registro acadêmico), e-mail alternativo (persistido em `emailPessoal`),
 * telefone, cidade/UF/país (UI only).
 */
export function PerfilContato({ form, set, emailLogin }: Props) {
  return (
    <PerfilSectionCard
      id="contato"
      icon={Mail}
      title="Contato e localização"
      description="Onde a UFRRJ e seus colegas conseguem te encontrar."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="mb-1.5 font-medium text-sm">E-mail institucional</div>
          <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-muted/40 px-3">
            <Mail className="size-4 text-muted-foreground" />
            <span className="flex-1 truncate text-sm text-foreground">{emailLogin}</span>
            <Badge variant="success">
              <Check /> Verificado
            </Badge>
          </div>
          <p className="mt-1.5 text-muted-foreground text-xs">
            Vinculado ao seu registro acadêmico — não pode ser alterado aqui.
          </p>
        </div>

        <Campo
          label="E-mail alternativo"
          hint="Para quando perder acesso ao institucional."
          type="email"
          placeholder="seu@email.com"
          value={form.emailPessoal}
          onChange={(v) => set('emailPessoal', v)}
        />
        <Campo
          label="Telefone / WhatsApp"
          placeholder="(00) 00000-0000"
          value={form.telefone}
          onChange={(v) => set('telefone', v)}
        />
        <Campo label="Cidade" value={form.cidade} onChange={(v) => set('cidade', v)} />
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="UF"
            value={form.uf}
            maxLength={2}
            className="uppercase"
            onChange={(v) => set('uf', v.toUpperCase().slice(0, 2))}
          />
          <Campo label="País" value={form.pais} onChange={(v) => set('pais', v)} />
        </div>
      </div>
    </PerfilSectionCard>
  )
}

function Campo({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  className = '',
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  maxLength?: number
  className?: string
}) {
  return (
    <label>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-medium text-sm">{label}</span>
        {hint && <span className="text-muted-foreground text-xs">· {hint}</span>}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={`flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      />
    </label>
  )
}
