import { ArrowRight, Check, Mail } from 'lucide-react'
import { Button } from '~/components/ui/button'

/** Confirmation shown after an egresso requests a magic-link sign-in. */
export function EntradaLoginLinkSent({ email, onBack }: { email: string; onBack: () => void }) {
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
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Outro e-mail
        </Button>
        <a
          href="#"
          className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          Simular clique no link <ArrowRight className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
