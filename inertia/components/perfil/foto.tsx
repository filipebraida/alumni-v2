import { Camera, Trash2, Upload } from 'lucide-react'
import { useRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { PerfilField, PerfilInput, PerfilTextarea } from '~/components/perfil/field'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type PerfilFormState } from '~/components/perfil/types'

const TAMANHO_MAX_BIO = 280

type Props = {
  form: PerfilFormState
  set: <K extends keyof PerfilFormState>(k: K, v: PerfilFormState[K]) => void
  foto: string | null
  setFoto: (foto: string | null) => void
  iniciais: string
}

/**
 * Seção "Foto e identidade": upload de avatar (preview client-side enquanto
 * upload real não existe) + nome completo, nome social, headline e resumo.
 */
export function PerfilFoto({ form, set, foto, setFoto, iniciais }: Props) {
  return (
    <PerfilSectionCard
      id="foto"
      icon={Camera}
      title="Foto e identidade"
      description="Como você aparece para colegas de turma e para a coordenação."
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <AvatarUpload foto={foto} setFoto={setFoto} iniciais={iniciais} />

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
          <PerfilField
            label="Nome completo"
            hint="Como você quer ser exibido no SAE — pode ser nome social."
            className="sm:col-span-2"
          >
            <PerfilInput value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </PerfilField>

          <PerfilField label="Como prefere ser chamado(a)" hint="Opcional — usado em saudações.">
            <PerfilInput
              value={form.nomeSocial}
              placeholder="Ex.: Ana"
              onChange={(e) => set('nomeSocial', e.target.value)}
            />
          </PerfilField>

          <PerfilField label="Título / headline" hint="Sua frase de carreira.">
            <PerfilInput
              value={form.headline}
              placeholder="Ex.: Engenheira de dados · GeoTI"
              onChange={(e) => set('headline', e.target.value)}
            />
          </PerfilField>

          <PerfilField
            label="Resumo"
            hint={`Até ${TAMANHO_MAX_BIO} caracteres.`}
            className="sm:col-span-2"
          >
            <PerfilTextarea
              value={form.bio}
              rows={3}
              onChange={(e) => set('bio', e.target.value.slice(0, TAMANHO_MAX_BIO))}
            />
            <div className="mt-1 text-right text-muted-foreground text-xs tabular-nums">
              {form.bio.length}/{TAMANHO_MAX_BIO}
            </div>
          </PerfilField>
        </div>
      </div>
    </PerfilSectionCard>
  )
}

function AvatarUpload({
  foto,
  setFoto,
  iniciais,
}: {
  foto: string | null
  setFoto: (foto: string | null) => void
  iniciais: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    const reader = new FileReader()
    reader.onload = () => setFoto(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(arquivo)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="group relative">
        <Avatar className="size-24 bg-primary text-2xl font-semibold text-primary-foreground">
          {foto && <AvatarImage src={foto} />}
          <AvatarFallback className="bg-primary text-primary-foreground">{iniciais}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 grid cursor-pointer place-items-center rounded-full bg-foreground/55 text-primary-foreground opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
          aria-label="Trocar foto"
        >
          <Camera className="size-6" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
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
  )
}
