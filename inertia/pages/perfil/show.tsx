import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Award, Camera, Check, Lock, Mail, MapPin, PencilIcon, Phone } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'

import { urlFor } from '~/client'
import { formatarCpf } from '~/lib/cpf'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PerfilAcademico } from '~/components/perfil/academico'
import { PerfilCoordenacao } from '~/components/perfil/coordenacao'
import { PerfilIdentificadoresShow } from '~/components/perfil/identificadores_show'
import { PerfilLayout } from '~/components/perfil/layout'
import { PerfilLinha } from '~/components/perfil/linha'
import { PerfilPrivacidadeShow } from '~/components/perfil/privacidade_show'
import { PerfilRail } from '~/components/perfil/rail'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { contarPreenchidos, secoesParaPerfil, useSecaoAtiva } from '~/components/perfil/secoes'
import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'

type Perfil = Data.User.Variants['forPerfil']
type PerfilEgresso = Data.Egresso.Variants['forPerfil']
type PerfilGestor = Data.Gestor.Variants['forPerfil']

type PageProps = InertiaProps<{
  // `usuario` (não `perfil`) pra não colidir com o `perfil` flags do
  // InertiaMiddleware.share (isEgresso/isGestor/isAdmin).
  usuario: Perfil
  egresso: PerfilEgresso | null
  gestor: PerfilGestor | null
}>

/**
 * "Meu perfil" — vista read-only. Identidade visível sempre presente; seções
 * "Vínculos acadêmicos" (se egresso) e "Coordenação" (se gestor) aparecem
 * condicionais ao papel do usuário.
 */
export default function PerfilShow({ usuario: perfil, egresso, gestor }: PageProps) {
  const secoes = useMemo(
    () => secoesParaPerfil({ temEgresso: !!egresso, temGestor: !!gestor }),
    [egresso, gestor]
  )
  const ativo = useSecaoAtiva(secoes)
  const preenchidos = contarPreenchidos(perfil)
  const localizacao = formatarLocalizacao(perfil)

  return (
    <PerfilLayout temEgresso={!!egresso}>
      <Head title="Meu perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <PerfilRail
            titulo="Meu perfil"
            descricao="Como você aparece para colegas e para a coordenação."
            ativo={ativo}
            preenchidos={preenchidos}
            secoes={secoes}
          />
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-9">
          <HeaderPerfil perfil={perfil} egresso={egresso} />

          <PerfilSectionCard
            id="foto"
            icon={Camera}
            title="Foto e identidade"
            description="Como você aparece para colegas e para a coordenação."
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <PerfilLinha rotulo="Nome de exibição" valor={perfil.fullName} />
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
              {egresso && (
                <PerfilLinha
                  rotulo="E-mail alternativo"
                  valor={
                    egresso.emailPessoal && (
                      <ValorComIcone icon={<Mail className="size-3.5 text-muted-foreground" />}>
                        {egresso.emailPessoal}
                      </ValorComIcone>
                    )
                  }
                />
              )}
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

          {egresso && <PerfilAcademico vinculos={egresso.vinculos} />}

          {gestor && <PerfilCoordenacao gestor={gestor} />}

          <PerfilSectionCard
            id="ids"
            icon={Award}
            title="Identificadores acadêmicos"
            description="Seus perfis de pesquisa e profissionais."
          >
            <PerfilIdentificadoresShow perfil={perfil} />
          </PerfilSectionCard>

          {egresso && (
            <PerfilSectionCard
              id="privacidade"
              icon={Lock}
              title="Privacidade"
              description="O que está sendo compartilhado com colegas."
            >
              <PerfilPrivacidadeShow perfil={perfil} />
            </PerfilSectionCard>
          )}
        </div>
      </div>
    </PerfilLayout>
  )
}

function HeaderPerfil({ perfil, egresso }: { perfil: Perfil; egresso: PerfilEgresso | null }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Avatar className="size-16 bg-primary font-semibold text-lg text-primary-foreground">
        {perfil.fotoUrl && <AvatarImage src={perfil.fotoUrl} />}
        <AvatarFallback className="bg-primary text-primary-foreground">
          {perfil.iniciais}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="font-semibold text-xl tracking-tight">
          {perfil.fullName || perfil.emailLogin}
        </h1>
        {perfil.headline && <p className="mt-0.5 text-foreground text-sm">{perfil.headline}</p>}
        <p className="mt-0.5 text-muted-foreground text-xs">
          {egresso && <>CPF {formatarCpf(egresso.cpf)} · </>}
          {perfil.emailLogin}
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
