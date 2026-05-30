import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Calendar, FileText, GraduationCap, MapPin, PencilIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { urlFor } from '~/client'
import { formatarCpf } from '~/lib/cpf'
import AppLayout from '~/layouts/app'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { type Perfil, type Vinculo } from '~/components/perfil/types'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  perfil: Perfil
  vinculos: Vinculo[]
}>

const SITUACAO_LABEL: Record<Vinculo['situacao'], string> = {
  cursando: 'Em curso',
  formado: 'Concluído',
  evadido: 'Evadido',
}

const SITUACAO_BADGE: Record<Vinculo['situacao'], 'success' | 'info' | 'outline'> = {
  cursando: 'info',
  formado: 'success',
  evadido: 'outline',
}

/**
 * Aterrissagem de "Meu perfil": resumo read-only do que está cadastrado, com
 * CTA pra editar. Os campos extras do design (bio, ORCID, etc.) ainda não
 * são persistidos — por isso a tela enxuta hoje.
 */
export default function PerfilShow({ perfil, vinculos }: PageProps) {
  return (
    <>
      <Head title="Meu perfil · SAE UFRRJ" />

      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-start gap-4">
          <Avatar className="size-16 bg-primary text-lg font-semibold text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {perfil.iniciais}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-xl tracking-tight">{perfil.nomeCompleto}</h1>
            <p className="mt-0.5 text-muted-foreground text-sm">
              CPF {formatarCpf(perfil.cpf)} · {perfil.emailLogin}
            </p>
          </div>
          <Button render={<Link href={urlFor('perfil.edit')} />}>
            <PencilIcon /> Editar perfil
          </Button>
        </header>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold text-sm tracking-tight">Contato</h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <Linha rotulo="E-mail institucional" valor={perfil.emailLogin} />
            <Linha rotulo="E-mail alternativo" valor={perfil.emailPessoal} />
          </dl>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold text-sm tracking-tight">Vínculos acadêmicos</h2>
          <div className="mt-3 space-y-3">
            {vinculos.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum vínculo encontrado.</p>
            )}
            {vinculos.map((v) => (
              <article key={v.id} className="rounded-lg border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground text-xs uppercase tracking-wider">
                        {v.nivel}
                      </span>
                      <Badge variant={SITUACAO_BADGE[v.situacao]} className="gap-1.5">
                        <span className="inline-block size-1.5 rounded-full bg-current" />
                        {SITUACAO_LABEL[v.situacao]}
                      </Badge>
                    </div>
                    <div className="mt-1.5 font-semibold text-sm leading-snug">{v.curso}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {v.instituto}
                      </span>
                      {v.periodoFormatura && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {v.periodoFormatura}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="size-3.5" />
                        Matrícula{' '}
                        <span className="font-medium text-foreground tabular-nums">{v.codigo}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

PerfilShow.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

function Linha({ rotulo, valor }: { rotulo: string; valor: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-xs uppercase tracking-wide">{rotulo}</dt>
      <dd className={`mt-0.5 truncate text-sm ${valor ? '' : 'text-muted-foreground'}`}>
        {valor ?? '—'}
      </dd>
    </div>
  )
}
