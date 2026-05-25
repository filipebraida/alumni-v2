import { ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Field, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

/**
 * Coordination / staff sign-in (same SIGAA credentials). Presentational mock —
 * the action is a placeholder until auth is wired.
 */
export function EntradaLoginCoordForm() {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>Usuário institucional</FieldLabel>
        <Input placeholder="ex: m.almeida" />
      </Field>
      <Field>
        <FieldLabel>Senha</FieldLabel>
        <Input type="password" placeholder="••••••••" />
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

      <Button size="lg" className="w-full" render={<a href="#" />}>
        Entrar
        <ArrowRight />
      </Button>

      <div className="rounded-lg bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Usa as mesmas credenciais do SIGAA. Apenas servidores com perfil de Coordenador de curso,
        Chefia de Departamento ou PROGRAD têm acesso aqui.
      </div>
    </div>
  )
}
