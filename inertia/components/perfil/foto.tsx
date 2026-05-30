import { Camera, Trash2, Upload } from 'lucide-react'
import { useRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/types'

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
  foto: string | null
  setFoto: (foto: string | null) => void
  iniciais: string
}

/**
 * Seção "Foto e identidade": upload de avatar (client-side: lê como dataURL
 * e mostra no preview — ainda sem upload pro server), nome, social,
 * headline, resumo. Os campos extras (social/headline/bio) vivem só no
 * estado do form por enquanto.
 */
export function PerfilFoto({ form, set, foto, setFoto, iniciais }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setFoto(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(f)
  }

  return (
    <PerfilSectionCard
      id="foto"
      icon={Camera}
      title="Foto e identidade"
      description="Como você aparece para colegas de turma e para a coordenação."
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-3">
          <div className="group relative">
            <Avatar className="size-24 bg-primary text-2xl font-semibold text-primary-foreground">
              {foto && <AvatarImage src={foto} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {iniciais}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 grid cursor-pointer place-items-center rounded-full bg-foreground/55 text-primary-foreground opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
              aria-label="Trocar foto"
            >
              <Camera className="size-6" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPick}
              className="hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <Upload /> {foto ? 'Trocar' : 'Enviar'}
            </Button>
            {foto && (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Remover foto"
                onClick={() => setFoto(null)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
          <p className="text-center text-muted-foreground text-xs leading-tight">
            JPG ou PNG
            <br />
            até 5 MB
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <CampoTexto
            className="sm:col-span-2"
            label="Nome completo"
            value={form.nomeCompleto}
            onChange={(v) => set('nomeCompleto', v)}
          />
          <CampoTexto
            label="Como prefere ser chamado(a)"
            hint="Opcional — usado em saudações."
            placeholder="Ex.: Ana"
            value={form.nomeSocial}
            onChange={(v) => set('nomeSocial', v)}
          />
          <CampoTexto
            label="Título / headline"
            hint="Sua frase de carreira."
            placeholder="Ex.: Engenheira de dados · GeoTI"
            value={form.headline}
            onChange={(v) => set('headline', v)}
          />
          <CampoArea
            className="sm:col-span-2"
            label="Resumo"
            hint="Até ~280 caracteres."
            value={form.bio}
            onChange={(v) => set('bio', v.slice(0, 280))}
          />
        </div>
      </div>
    </PerfilSectionCard>
  )
}

function CampoTexto({
  label,
  hint,
  placeholder,
  value,
  onChange,
  className,
}: {
  label: string
  hint?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={className}>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-medium text-sm">{label}</span>
        {hint && <span className="text-muted-foreground text-xs">· {hint}</span>}
      </div>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  )
}

function CampoArea({
  label,
  hint,
  value,
  onChange,
  className,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={className}>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="font-medium text-sm">{label}</span>
        {hint && <span className="text-muted-foreground text-xs">· {hint}</span>}
      </div>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-1 text-right text-muted-foreground text-xs tabular-nums">
        {value.length}/280
      </div>
    </label>
  )
}
