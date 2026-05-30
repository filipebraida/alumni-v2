import { Head } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import {
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Check,
  GraduationCap,
  Globe,
  Link as LinkIcon,
  type LucideIcon,
  Lock,
  Mail,
  MapPin,
  PencilIcon,
  Phone,
} from 'lucide-react'
import { type ReactElement, type ReactNode, useEffect, useState } from 'react'

import { cn } from '~/lib/utils'
import { urlFor } from '~/client'
import { formatarCpf } from '~/lib/cpf'
import AppLayout from '~/layouts/app'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PerfilAcademico } from '~/components/perfil/academico'
import { PerfilCompletude } from '~/components/perfil/completude'
import { PerfilSectionCard } from '~/components/perfil/section_card'
import { type Perfil, type Vinculo } from '~/components/perfil/types'
import { type InertiaProps } from '~/types'

type SecaoId = 'foto' | 'contato' | 'academico' | 'ids' | 'privacidade'
type Secao = { id: SecaoId; icon: LucideIcon; label: string }

const SECOES: readonly Secao[] = [
  { id: 'foto', icon: Camera, label: 'Foto e identidade' },
  { id: 'contato', icon: Mail, label: 'Contato e local' },
  { id: 'academico', icon: GraduationCap, label: 'Vínculos acadêmicos' },
  { id: 'ids', icon: Award, label: 'Identificadores' },
  { id: 'privacidade', icon: Lock, label: 'Privacidade' },
] as const

/** Os 8 campos "públicos" que contam pra completude (mesma régua do edit). */
function contarPreenchidos(perfil: Perfil): number {
  const checks = [
    !!perfil.fotoUrl,
    !!perfil.headline,
    !!perfil.bio,
    !!perfil.telefone,
    !!perfil.cidade,
    !!perfil.lattes,
    !!perfil.orcid,
    !!perfil.linkedin,
  ]
  return checks.filter(Boolean).length
}

type PageProps = InertiaProps<{
  perfil: Perfil
  vinculos: Vinculo[]
}>

/**
 * "Meu perfil" — vista read-only. Espelha o layout do `edit` (mesmos
 * SectionCards, mesmos ícones) pra dar continuidade visual. Mostra todos os
 * campos preenchidos; quem está em branco vira "—" muted.
 */
export default function PerfilShow({ perfil, vinculos }: PageProps) {
  const cidadeUf = [perfil.cidade, perfil.uf].filter(Boolean).join(' · ')
  const localizacao = [cidadeUf, perfil.pais].filter(Boolean).join(' — ')
  const ativo = useSecaoAtiva()
  const preenchidos = contarPreenchidos(perfil)

  return (
    <>
      <Head title="Meu perfil · SAE UFRRJ" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <RailShow ativo={ativo} preenchidos={preenchidos} />
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-9">
          <header className="flex flex-wrap items-start gap-4">
            <Avatar className="size-16 bg-primary font-semibold text-lg text-primary-foreground">
              {perfil.fotoUrl && <AvatarImage src={perfil.fotoUrl} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {perfil.iniciais}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-xl tracking-tight">{perfil.nomeCompleto}</h1>
              {perfil.headline && (
                <p className="mt-0.5 text-foreground text-sm">{perfil.headline}</p>
              )}
              <p className="mt-0.5 text-muted-foreground text-xs">
                CPF {formatarCpf(perfil.cpf)} · {perfil.emailLogin}
              </p>
            </div>
            <Button render={<Link href={urlFor('perfil.edit')} />}>
              <PencilIcon /> Editar perfil
            </Button>
          </header>

          <PerfilSectionCard
            id="foto"
            icon={Camera}
            title="Foto e identidade"
            description="Como você aparece para colegas e para a coordenação."
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Linha rotulo="Nome completo" valor={perfil.nomeCompleto} />
              <Linha rotulo="Como prefere ser chamado(a)" valor={perfil.nomeSocial} />
              <Linha rotulo="Título / headline" valor={perfil.headline} className="sm:col-span-2" />
              <Linha rotulo="Resumo" valor={perfil.bio} className="sm:col-span-2" multilinha />
            </dl>
          </PerfilSectionCard>

          <PerfilSectionCard
            id="contato"
            icon={Mail}
            title="Contato e localização"
            description="Onde a UFRRJ e seus colegas conseguem te encontrar."
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Linha
                className="sm:col-span-2"
                rotulo="E-mail institucional"
                valor={
                  <span className="inline-flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground" />
                    {perfil.emailLogin}
                    <Badge variant="success">
                      <Check /> Verificado
                    </Badge>
                  </span>
                }
              />
              <Linha
                rotulo="E-mail alternativo"
                valor={
                  perfil.emailPessoal ? (
                    <span className="inline-flex items-center gap-2">
                      <Mail className="size-3.5 text-muted-foreground" />
                      {perfil.emailPessoal}
                    </span>
                  ) : null
                }
              />
              <Linha
                rotulo="Telefone / WhatsApp"
                valor={
                  perfil.telefone ? (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-3.5 text-muted-foreground" />
                      {perfil.telefone}
                    </span>
                  ) : null
                }
              />
              <Linha
                rotulo="Localização"
                valor={
                  localizacao ? (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {localizacao}
                    </span>
                  ) : null
                }
                className="sm:col-span-2"
              />
            </dl>
          </PerfilSectionCard>

          {/* PerfilAcademico já é read-only — reaproveita o mesmo componente do edit. */}
          <PerfilAcademico vinculos={vinculos} />

          <PerfilSectionCard
            id="ids"
            icon={Award}
            title="Identificadores acadêmicos"
            description="Seus perfis de pesquisa e profissionais."
          >
            <Identificadores perfil={perfil} />
          </PerfilSectionCard>

          <PerfilSectionCard
            id="privacidade"
            icon={Lock}
            title="Privacidade"
            description="O que está sendo compartilhado com colegas."
          >
            <ul className="divide-y rounded-lg border">
              <PrivacyLinha
                ativa={perfil.visEmail}
                titulo="Meu e-mail para colegas de turma"
                detalhe="A coordenação sempre tem acesso."
              />
              <PrivacyLinha
                ativa={perfil.visMapa}
                titulo="Aparecer no mapa da turma"
                detalhe="Sua cidade/UF entra no mapa coletivo."
              />
              <PrivacyLinha
                ativa={perfil.visEncontrar}
                titulo="Permitir que colegas me encontrem"
                detalhe="Aparece em sugestões de reconexão."
              />
              <li className="flex items-center gap-3 bg-muted/30 px-4 py-3 text-muted-foreground">
                <Lock className="size-4" />
                <span className="text-sm">
                  Faixa salarial sempre anônima — exibida apenas em médias agregadas (LGPD).
                </span>
              </li>
            </ul>
          </PerfilSectionCard>
        </div>
      </div>
    </>
  )
}

function useSecaoAtiva(): SecaoId {
  const [ativo, setAtivo] = useState<SecaoId>(SECOES[0].id)
  useEffect(() => {
    const elementos = SECOES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (elementos.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visivel) setAtivo(visivel.target.id as SecaoId)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    elementos.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ativo
}

function irPara(id: SecaoId) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function RailShow({ ativo, preenchidos }: { ativo: SecaoId; preenchidos: number }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-6">
        <div>
          <h1 className="font-semibold text-xl tracking-tight">Meu perfil</h1>
          <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
            Como você aparece para colegas e para a coordenação.
          </p>
        </div>
        <nav className="-mx-2 flex flex-col gap-0.5">
          {SECOES.map((s) => {
            const Icon = s.icon
            const isActive = ativo === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => irPara(s.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left font-medium text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" /> {s.label}
              </button>
            )
          })}
        </nav>
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <PerfilCompletude preenchidos={preenchidos} total={8} />
          <p className="mt-3 text-muted-foreground text-xs leading-relaxed">
            Perfis completos aparecem com mais clareza para colegas e coordenação.
          </p>
        </div>
      </div>
    </aside>
  )
}

PerfilShow.layout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

function Linha({
  rotulo,
  valor,
  className,
  multilinha = false,
}: {
  rotulo: string
  valor: ReactNode
  className?: string
  multilinha?: boolean
}) {
  const vazio = valor === null || valor === undefined || valor === ''
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-muted-foreground text-xs uppercase tracking-wide">{rotulo}</dt>
      <dd
        className={cn(
          'mt-0.5 text-sm',
          vazio && 'text-muted-foreground',
          !multilinha && 'truncate'
        )}
      >
        {vazio ? '—' : valor}
      </dd>
    </div>
  )
}

function PrivacyLinha({
  ativa,
  titulo,
  detalhe,
}: {
  ativa: boolean
  titulo: string
  detalhe: string
}) {
  return (
    <li className="flex items-center gap-4 px-4 py-3.5">
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-xs',
          ativa ? 'bg-success/10 text-success-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        <span className="inline-block size-1.5 rounded-full bg-current" />
        {ativa ? 'visível' : 'oculto'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm">{titulo}</div>
        <div className="mt-0.5 text-muted-foreground text-xs">{detalhe}</div>
      </div>
    </li>
  )
}

type IdLink = {
  key: string
  label: string
  icon: ReactNode
  href: string
  display: string
}

/** Tira o protocolo pra exibir, mantém o resto exatamente como o href. */
function semProtocolo(url: string): string {
  return url.replace(/^https?:\/\//, '')
}

function montarIdentificadores(perfil: Perfil): IdLink[] {
  const ids: IdLink[] = []
  if (perfil.orcid) {
    const url = `https://orcid.org/${perfil.orcid}`
    ids.push({
      key: 'orcid',
      label: 'ORCID iD',
      icon: <GlifoTexto texto="iD" tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  if (perfil.lattes) {
    const digitos = perfil.lattes.replace(/\D/g, '')
    const url = perfil.lattes.startsWith('http')
      ? perfil.lattes
      : digitos.length === 16
        ? `https://lattes.cnpq.br/${digitos}`
        : perfil.lattes
    ids.push({
      key: 'lattes',
      label: 'Currículo Lattes',
      icon: <GlifoIcone icon={<BookOpen className="size-4" />} tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  if (perfil.scholar) {
    const url = perfil.scholar.startsWith('http') ? perfil.scholar : `https://${perfil.scholar}`
    ids.push({
      key: 'scholar',
      label: 'Google Scholar',
      icon: <GlifoIcone icon={<GraduationCap className="size-4" />} tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  if (perfil.linkedin) {
    const url = `https://linkedin.com/in/${perfil.linkedin}`
    ids.push({
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <GlifoIcone icon={<Briefcase className="size-4" />} tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  if (perfil.github) {
    const url = `https://github.com/${perfil.github}`
    ids.push({
      key: 'github',
      label: 'GitHub',
      icon: <GlifoIcone icon={<LinkIcon className="size-4" />} tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  if (perfil.site) {
    const url = perfil.site.startsWith('http') ? perfil.site : `https://${perfil.site}`
    ids.push({
      key: 'site',
      label: 'Site / portfólio',
      icon: <GlifoIcone icon={<Globe className="size-4" />} tom="success" />,
      href: url,
      display: semProtocolo(url),
    })
  }
  return ids
}

function Identificadores({ perfil }: { perfil: Perfil }) {
  const ids = montarIdentificadores(perfil)
  if (ids.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum identificador conectado ainda.{' '}
        <Link
          href={urlFor('perfil.edit')}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Adicionar agora
        </Link>
        .
      </p>
    )
  }
  return (
    <ul className="space-y-3">
      {ids.map((id) => (
        <li key={id.key} className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
          {id.icon}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm">{id.label}</div>
            <a
              href={id.href}
              target="_blank"
              rel="noreferrer noopener"
              className="truncate text-muted-foreground text-xs hover:text-primary hover:underline"
            >
              {id.display}
            </a>
          </div>
          <a
            href={id.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Abrir ${id.label}`}
          >
            <LinkIcon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}

function GlifoTexto({ texto, tom }: { texto: string; tom: 'primary' | 'success' | 'muted' }) {
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-md font-bold text-sm',
        tom === 'primary' && 'bg-primary/10 text-primary',
        tom === 'success' && 'bg-success/10 text-success-foreground',
        tom === 'muted' && 'bg-muted text-muted-foreground'
      )}
    >
      {texto}
    </span>
  )
}

function GlifoIcone({ icon, tom }: { icon: ReactNode; tom: 'primary' | 'success' | 'muted' }) {
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-md',
        tom === 'primary' && 'bg-primary/10 text-primary',
        tom === 'success' && 'bg-success/10 text-success-foreground',
        tom === 'muted' && 'bg-muted text-muted-foreground'
      )}
    >
      {icon}
    </span>
  )
}
