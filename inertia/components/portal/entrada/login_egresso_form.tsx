import { ArrowRight, Mail } from 'lucide-react'
import { useState } from 'react'
import { EntradaLoginLinkSent } from '~/components/portal/entrada/login_link_sent'
import { Button } from '~/components/ui/button'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '~/components/ui/input-group'

/** Institutional e-mail field with the fixed `@ufrrj.br` suffix as an addon. */
function EmailField({
  value,
  onChange,
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}) {
  return (
    <Field>
      <FieldLabel>E-mail institucional</FieldLabel>
      <InputGroup>
        <InputGroupInput
          type="email"
          placeholder="nome.sobrenome"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoFocus={autoFocus}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@ufrrj.br</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

/**
 * Egresso sign-in: password by default, with a passwordless magic-link path.
 * Presentational mock — the actions are placeholders until auth is wired.
 */
export function EntradaLoginEgressoForm() {
  const [method, setMethod] = useState<'password' | 'link'>('password')
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  if (sent) {
    return <EntradaLoginLinkSent email={email} onBack={() => setSent(false)} />
  }

  if (method === 'link') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Entrar com link no e-mail
          </span>
          <button
            type="button"
            onClick={() => setMethod('password')}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← usar senha
          </button>
        </div>
        <EmailField value={email} onChange={setEmail} autoFocus />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Se a Coordenação do seu curso já te cadastrou, o link chega em segundos. Ele expira em 15
          minutos.
        </p>
        <Button size="lg" className="w-full" onClick={() => setSent(true)}>
          <Mail />
          Enviar link de acesso
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <EmailField value={email} onChange={setEmail} />
      <Field>
        <FieldLabel>Senha</FieldLabel>
        <Input type="password" placeholder="••••••••" />
      </Field>
      <Button size="lg" className="w-full" render={<a href="#" />}>
        Entrar
        <ArrowRight />
      </Button>

      <div className="flex items-center gap-3 pt-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <Button variant="outline" size="lg" className="w-full" onClick={() => setMethod('link')}>
        <Mail className="text-primary" />
        Receber link de acesso no e-mail
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Sem senha? Sem problema. Mandamos um link direto pro seu e-mail institucional.
      </p>

      <div className="border-t pt-4 text-center text-xs text-muted-foreground">
        Ainda não foi cadastrado pela Coordenação?{' '}
        <a href="#" className="text-foreground underline-offset-4 hover:underline">
          Solicitar vínculo
        </a>
      </div>
    </div>
  )
}
