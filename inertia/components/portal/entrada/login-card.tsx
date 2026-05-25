'use client'

import { ArrowRight, Check, Mail } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { cn } from '~/lib/utils'

const inputClass =
  'flex h-11 w-full rounded-md border border-input bg-background px-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function LoginTab({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}

function SentState({ email, onBack }: { email: string; onBack: () => void }) {
  const display = email.trim() ? `${email.trim()}@ufrrj.br` : 'seu e-mail @ufrrj.br'
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-4">
        <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">Link enviado</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Acabamos de mandar um link de acesso pra{' '}
            <span className="break-all font-medium text-foreground">{display}</span>. Ele expira em
            15 minutos.
          </div>
        </div>
      </div>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-3.5 text-primary" /> Não chegou? Confira o spam ou aguarde 1
          minuto.
        </li>
        <li className="flex items-start gap-2">
          <Check className="mt-0.5 size-3.5 text-primary" /> O e-mail só funciona se a Coordenação
          já te cadastrou.
        </li>
      </ul>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-sm font-medium hover:bg-muted/50"
        >
          ← Outro e-mail
        </button>
        <a
          href="#"
          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          Simular clique no link <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  )
}

export function LoginCard() {
  const [tab, setTab] = useState<'egresso' | 'coord'>('egresso')
  const [method, setMethod] = useState<'password' | 'link' | 'sent'>('password')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [coordUser, setCoordUser] = useState('')
  const [coordPass, setCoordPass] = useState('')

  return (
    <div className="relative rounded-2xl border bg-card p-7 shadow-sm">
      <span className="absolute -top-2 right-6 inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-block size-1.5 rounded-full bg-brand-yellow" />
        Acesso ao SAE
      </span>

      <div className="space-y-1.5">
        <h2 className="text-[20px] font-semibold tracking-tight">Acesse seu painel</h2>
        <p className="text-sm text-muted-foreground">
          {tab === 'egresso'
            ? 'Use o e-mail @ufrrj.br cadastrado pela sua Coordenação.'
            : 'Login institucional de coordenadores e servidores.'}
        </p>
      </div>

      <div className="mt-5 inline-flex w-full rounded-md border bg-muted/30 p-0.5 text-xs">
        <LoginTab
          active={tab === 'egresso'}
          onClick={() => {
            setTab('egresso')
            setMethod('password')
          }}
        >
          Egresso
        </LoginTab>
        <LoginTab active={tab === 'coord'} onClick={() => setTab('coord')}>
          Coordenação
        </LoginTab>
      </div>

      <div className="mt-5 space-y-4">
        {tab === 'egresso' && method === 'password' && (
          <>
            <Field label="E-mail institucional">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.sobrenome"
                  className={cn(inputClass, 'pr-27.5')}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @ufrrj.br
                </span>
              </div>
            </Field>
            <Field label="Senha">
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>
            <a
              href="#"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar <ArrowRight className="size-4" />
            </a>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              onClick={() => setMethod('link')}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium transition-colors hover:bg-muted/50"
            >
              <Mail className="size-4 text-primary" />
              Receber link de acesso no e-mail
            </button>
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Sem senha? Sem problema. Mandamos um link direto pro seu e-mail institucional.
            </p>

            <div className="border-t pt-4 text-center text-xs text-muted-foreground">
              Ainda não foi cadastrado pela Coordenação?{' '}
              <a href="#" className="text-foreground underline-offset-4 hover:underline">
                Solicitar vínculo
              </a>
            </div>
          </>
        )}

        {tab === 'egresso' && method === 'link' && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Entrar com link no e-mail
              </div>
              <button
                type="button"
                onClick={() => setMethod('password')}
                className="text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ← usar senha
              </button>
            </div>
            <Field label="E-mail institucional">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome.sobrenome"
                  className={cn(inputClass, 'pr-[110px]')}
                  autoFocus
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @ufrrj.br
                </span>
              </div>
            </Field>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Se a Coordenação do seu curso já te cadastrou, o link chega em segundos. Ele expira em
              15 minutos.
            </p>
            <button
              type="button"
              onClick={() => setMethod('sent')}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Mail className="size-4" />
              Enviar link de acesso
            </button>
          </>
        )}

        {tab === 'egresso' && method === 'sent' && (
          <SentState email={email} onBack={() => setMethod('link')} />
        )}

        {tab === 'coord' && (
          <>
            <Field label="Usuário institucional">
              <input
                value={coordUser}
                onChange={(e) => setCoordUser(e.target.value)}
                placeholder="ex: m.almeida"
                className={inputClass}
              />
            </Field>
            <Field label="Senha">
              <input
                type="password"
                value={coordPass}
                onChange={(e) => setCoordPass(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="size-3.5 rounded border-input accent-primary" />
                Manter conectado
              </label>
              <a
                href="#"
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Esqueci a senha
              </a>
            </div>
            <a
              href="#"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar <ArrowRight className="size-4" />
            </a>
            <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
              Usa as mesmas credenciais do SIGAA. Apenas servidores com perfil de Coordenador de
              curso, Chefia de Departamento ou PROGRAD têm acesso aqui.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
