import { useEffect, useRef, useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Data } from '@generated/data'
import { ArrowLeft, Mail } from 'lucide-react'
import { PortalLogo } from '~/components/portal/logo'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { cn } from '~/lib/utils'

interface LoginProps {
  pendingEmail: string | null
}

const CODE_LENGTH = 6
const RESEND_SECONDS = 60

/**
 * Dedicated, focused login experience (design "Entrar v2"). The whole
 * passwordless flow lives here: email step, then the 6-digit code step. Which
 * one renders is driven by `pendingEmail` from the server session.
 */
export default function Login({ pendingEmail }: LoginProps) {
  return (
    <div className="portal-theme relative min-h-svh overflow-hidden bg-background font-sans text-foreground antialiased">
      <Head title="Entrar · SAE UFRRJ" />
      <LoginBackground />

      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link route="home" className="flex items-center gap-2.5">
            <PortalLogo />
            <span className="text-sm font-semibold tracking-tight">
              SAE <span className="font-normal text-muted-foreground">· UFRRJ</span>
            </span>
          </Link>
          <Link
            route="home"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← conhecer o SAE
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-8 md:pt-16">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Acesso ao painel
            </div>
            <h1 className="mt-2 font-serif text-3xl font-medium leading-tight tracking-tight">
              Entre na sua <span className="italic text-primary">Rural.</span>
            </h1>
          </div>

          {pendingEmail ? <CodeStep email={pendingEmail} /> : <EmailStep />}

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
                Problemas para entrar?
              </a>
              <span className="text-border">·</span>
              <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">
                Falar com a PROGRAD
              </a>
            </div>
            <div className="text-xs text-muted-foreground/80">
              Vinculado à Pró-Reitoria de Graduação · UFRRJ
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/70">
          <span className="inline-block h-px w-8 bg-border" />
          12 anos de mapeamento contínuo
          <span className="inline-block h-px w-8 bg-border" />
        </div>
      </main>
    </div>
  )
}

/* ─────────── Email step ─────────── */
function EmailStep() {
  return (
    <LoginCard badge="Acesso ao SAE">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Acesse seu painel</h2>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail. Mandamos um código de 6 dígitos para você confirmar.
        </p>
      </div>

      <Form route="codigo_acesso.store" className="mt-5">
        {({ processing }) => (
          <div className="flex flex-col gap-4">
            <Field name="email">
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="nome.sobrenome@ufrrj.br"
              />
              <FieldError />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={processing}>
              <Mail />
              Enviar código de acesso
            </Button>
          </div>
        )}
      </Form>

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        O código chega em segundos e vale por 10 minutos. Sem senha para decorar.
      </p>

      <div className="mt-5 border-t pt-4 text-center text-xs text-muted-foreground">
        Ainda não foi cadastrado?{' '}
        <a href="#" className="text-foreground underline-offset-4 hover:underline">
          Solicitar vínculo
        </a>
      </div>
    </LoginCard>
  )
}

/* ─────────── Code step ─────────── */
function CodeStep({ email }: { email: string }) {
  const { flash } = usePage<Data.SharedProps>().props
  const [digits, setDigits] = useState(() => Array<string>(CODE_LENGTH).fill(''))
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_SECONDS)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const code = digits.join('')
  const complete = code.length === CODE_LENGTH && /^\d+$/.test(code)

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  useEffect(() => {
    if (!complete || submitting) return
    setSubmitting(true)
    router.post(
      '/login',
      { code },
      {
        onFinish: () => {
          setSubmitting(false)
          setDigits(Array<string>(CODE_LENGTH).fill(''))
          inputs.current[0]?.focus()
        },
      }
    )
  }, [complete])

  function setDigit(i: number, value: string) {
    const v = value.replace(/\D/g, '').slice(0, 1)
    setDigits((prev) => {
      const next = [...prev]
      next[i] = v
      return next
    })
    if (v && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus()
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus()
  }

  function onPaste(e: React.ClipboardEvent) {
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!text) return
    e.preventDefault()
    const next = Array<string>(CODE_LENGTH).fill('')
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setDigits(next)
    inputs.current[Math.min(text.length, CODE_LENGTH - 1)]?.focus()
  }

  return (
    <LoginCard badge="Código enviado">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Digite o código</h2>
        <p className="text-sm text-muted-foreground">
          Mandamos um código de {CODE_LENGTH} dígitos para{' '}
          <span className="font-medium text-foreground">{email}</span>.
        </p>
      </div>

      <div
        className="mt-6 grid grid-cols-6 gap-2"
        role="group"
        aria-label="Código de acesso"
        onPaste={onPaste}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={d}
            disabled={submitting}
            aria-invalid={!!flash.error}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className={cn(
              'h-14 w-full rounded-md border bg-background text-center font-mono text-2xl font-semibold tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring',
              flash.error ? 'border-destructive focus:ring-destructive' : 'border-input',
              submitting && 'opacity-60'
            )}
          />
        ))}
      </div>

      {flash.error && (
        <p role="alert" className="mt-3 text-center text-xs text-destructive-foreground">
          {flash.error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between rounded-lg bg-muted/40 px-3.5 py-3 text-xs text-muted-foreground">
        <span>Não recebeu? Confira o spam.</span>
        {cooldown > 0 ? (
          <span className="tabular-nums">
            Reenviar em <span className="font-medium text-foreground">{cooldown}s</span>
          </span>
        ) : (
          <Form route="codigo_acesso.store">
            <input type="hidden" name="email" value={email} />
            <button
              type="submit"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Reenviar código
            </button>
          </Form>
        )}
      </div>

      <div className="mt-4">
        <Form route="codigo_acesso.destroy">
          <Button type="submit" variant="outline" size="sm">
            <ArrowLeft />
            Usar outro e-mail
          </Button>
        </Form>
      </div>

      <div className="mt-5 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
        O código vale por 10 minutos. Se expirar, peça um novo aqui mesmo.
      </div>
    </LoginCard>
  )
}

/* ─────────── Shared card shell ─────────── */
function LoginCard({ badge, children }: { badge: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border bg-card p-7 shadow-sm">
      <span className="absolute -top-2 right-6 inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        <span className="inline-block size-1.5 rounded-full bg-brand-yellow" />
        {badge}
      </span>
      {children}
    </div>
  )
}

/* ─────────── Background: dots + soft halo ─────────── */
function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-35">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="entrarDots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="var(--border)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#entrarDots)" />
      </svg>
    </div>
  )
}
