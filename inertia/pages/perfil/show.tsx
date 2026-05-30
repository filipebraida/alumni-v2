import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Award, Camera, Check, Lock, Mail, MapPin, PencilIcon, Phone } from 'lucide-react'
import { type ReactElement, type ReactNode } from 'react'

import { urlFor } from '~/client'
import { formatarCpf } from '~/lib/cpf'
import AppLayout from '~/layouts/app'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PerfilAcademico } from '~/components/perfil/academico'
import { PerfilIdentificadoresShow } from '~/components/perfil/identificadores_show'
import { PerfilLinha } from '~/components/perfil/linha'
import { PerfilPrivacidadeShow } from '~/components/perfil/privacidade_show'
import { PerfilRail } from '~/components/perfil/rail'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { contarPreenchidos, useSecaoAtiva } from '~/components/perfil/secoes'
import { type Perfil, type Vinculo } from '~/components/perfil/types'
import { type InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  perfil: Perfil
  vinculos: Vinculo[]
}>

/**
 * "Meu perfil" — vista read-only do que está cadastrado. Espelha o layout
 * do `edit` (rail + 5 SectionCards na mesma ordem). Campos não preenchidos
 * aparecem como "—".
 */
export default function PerfilShow({ perfil, vinculos }: PageProps) {
  const ativo = useSecaoAtiva()
  const preenchidos = contarPreenchidos(perfil)
  const localizacao = formatarLocalizacao(perfil)

  return (
    <>
      <Head title="Meu perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <PerfilRail
            titulo="Meu perfil"
            descricao="Como você aparece para colegas e para a coordenação."
            ativo={ativo}
            preenchidos={preenchidos}
          />
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-9">
          <HeaderPerfil perfil={perfil} />

          <PerfilSectionCard
            id="foto"
            icon={Camera}
            title="Foto e identidade"
            description="Como você aparece para colegas e para a coordenação."
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <PerfilLinha rotulo="Nome completo" valor={perfil.nomeCompleto} />
              <PerfilLinha rotulo="Como prefere ser chamado(a)" valor={perfil.nomeSocial} />
              <PerfilLinha
                rotulo="Título / headline"
                valor={perfil.headline}
                className="sm:col-span-2"
              />
              <PerfilLinha
                rotulo="Resumo"
                valor={perfil.bio}
                className="sm:col-span-2"
                multilinha
              />
            </dl>
          </PerfilSectionCard>

          <PerfilSectionCard
            id="contato"
            icon={Mail}
            title="Contato e localização"
            description="Onde a UFRRJ e seus colegas conseguem te encontrar."
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <PerfilLinha
                className="sm:col-span-2"
                rotulo="E-mail institucional"
                valor={
                  <ValorComIcone icon={<Mail className="size-3.5 text-muted-foreground" />}>
                    <span className="truncate">{perfil.emailLogin}</span>
                    <Badge variant="success" className="shrink-0">
                      <Check /> Verificado
                    </Badge>
                  </ValorComIcone>
                }
              />
              <PerfilLinha
                rotulo="E-mail alternativo"
                valor={
                  perfil.emailPessoal && (
                    <ValorComIcone icon={<Mail className="size-3.5 text-muted-foreground" />}>
                      {perfil.emailPessoal}
                    </ValorComIcone>
                  )
                }
              />
              <PerfilLinha
                rotulo="Telefone / WhatsApp"
                valor={
                  perfil.telefone && (
                    <ValorComIcone icon={<Phone className="size-3.5 text-muted-foreground" />}>
                      {perfil.telefone}
                    </ValorComIcone>
                  )
                }
              />
              <PerfilLinha
                rotulo="Localização"
                className="sm:col-span-2"
                valor={
                  localizacao && (
                    <ValorComIcone icon={<MapPin className="size-3.5 text-muted-foreground" />}>
                      {localizacao}
                    </ValorComIcone>
                  )
                }
              />
            </dl>
          </PerfilSectionCard>

          <PerfilAcademico vinculos={vinculos} />

          <PerfilSectionCard
            id="ids"
            icon={Award}
            title="Identificadores acadêmicos"
            description="Seus perfis de pesquisa e profissionais."
          >
            <PerfilIdentificadoresShow perfil={perfil} />
          </PerfilSectionCard>

          <PerfilSectionCard
            id="privacidade"
            icon={Lock}
            title="Privacidade"
            description="O que está sendo compartilhado com colegas."
          >
            <PerfilPrivacidadeShow perfil={perfil} />
          </PerfilSectionCard>
        </div>
      </div>
    </>
  )
}

PerfilShow.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

function HeaderPerfil({ perfil }: { perfil: Perfil }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Avatar className="size-16 bg-primary font-semibold text-lg text-primary-foreground">
        {perfil.fotoUrl && <AvatarImage src={perfil.fotoUrl} />}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {perfil.iniciais}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="font-semibold text-xl tracking-tight">{perfil.nomeCompleto}</h1>
        {perfil.headline && <p className="mt-0.5 text-foreground text-sm">{perfil.headline}</p>}
        <p className="mt-0.5 text-muted-foreground text-xs">
          CPF {formatarCpf(perfil.cpf)} · {perfil.emailLogin}
        </p>
      </div>
      <Button className="w-full sm:w-auto" render={<Link href={urlFor('perfil.edit')} />}>
        <PencilIcon /> Editar perfil
      </Button>
    </header>
  )
}

function ValorComIcone({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span className="shrink-0">{icon}</span>
      {children}
    </span>
  )
}

function formatarLocalizacao(perfil: Perfil): string {
  const cidadeUf = [perfil.cidade, perfil.uf].filter(Boolean).join(' · ')
  return [cidadeUf, perfil.pais].filter(Boolean).join(' — ')
}
