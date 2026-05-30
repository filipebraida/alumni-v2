import { Check, Mail } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { PerfilField, PerfilInput } from '~/components/perfil/field'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/types'

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
  emailLogin: string
}

/**
 * "Contato e localização": e-mail institucional read-only (linkado ao
 * registro acadêmico) + e-mail alternativo, telefone, cidade/UF/país.
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
        <EmailInstitucional email={emailLogin} className="sm:col-span-2" />

        <PerfilField label="E-mail alternativo" hint="Para quando perder acesso ao institucional.">
          <PerfilInput
            type="email"
            value={form.emailPessoal}
            placeholder="seu@email.com"
            onChange={(e) => set('emailPessoal', e.target.value)}
          />
        </PerfilField>

        <PerfilField label="Telefone / WhatsApp">
          <PerfilInput
            value={form.telefone}
            placeholder="(00) 00000-0000"
            onChange={(e) => set('telefone', e.target.value)}
          />
        </PerfilField>

        <PerfilField label="Cidade">
          <PerfilInput value={form.cidade} onChange={(e) => set('cidade', e.target.value)} />
        </PerfilField>

        <div className="grid grid-cols-3 gap-4">
          <PerfilField label="UF" className="col-span-1">
            <PerfilInput
              value={form.uf}
              maxLength={2}
              className="uppercase"
              onChange={(e) => set('uf', e.target.value.toUpperCase().slice(0, 2))}
            />
          </PerfilField>
          <PerfilField label="País" className="col-span-2">
            <PerfilInput value={form.pais} onChange={(e) => set('pais', e.target.value)} />
          </PerfilField>
        </div>
      </div>
    </PerfilSectionCard>
  )
}

function EmailInstitucional({ email, className }: { email: string; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1.5 font-medium text-sm">E-mail institucional</div>
      <div className="flex h-9 min-w-0 items-center gap-2 rounded-md border border-input bg-muted/40 px-3">
        <Mail className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">{email}</span>
        <Badge variant="success" className="shrink-0">
          <Check /> Verificado
        </Badge>
      </div>
      <p className="mt-1.5 text-muted-foreground text-xs">
        Vinculado ao seu registro acadêmico — não pode ser alterado aqui.
      </p>
    </div>
  )
}
