import { Link } from '@adonisjs/inertia/react'
import { BookOpen, Briefcase, GraduationCap, Globe, Link as LinkIcon } from 'lucide-react'
import { type ReactNode } from 'react'

import { urlFor } from '~/client'
import { GlifoIcone, GlifoTexto } from '~/components/perfil/glifo'
import { type Perfil } from '~/components/perfil/types'

type IdLink = {
  key: string
  label: string
  glifo: ReactNode
  href: string
  display: string
}

/** Tira o protocolo só pra exibir; href mantém a URL completa. */
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
      glifo: <GlifoTexto texto="iD" conectado />,
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
      glifo: <GlifoIcone icon={BookOpen} conectado />,
      href: url,
      display: semProtocolo(url),
    })
  }

  if (perfil.scholar) {
    const url = perfil.scholar.startsWith('http') ? perfil.scholar : `https://${perfil.scholar}`
    ids.push({
      key: 'scholar',
      label: 'Google Scholar',
      glifo: <GlifoIcone icon={GraduationCap} conectado />,
      href: url,
      display: semProtocolo(url),
    })
  }

  if (perfil.linkedin) {
    const url = `https://linkedin.com/in/${perfil.linkedin}`
    ids.push({
      key: 'linkedin',
      label: 'LinkedIn',
      glifo: <GlifoIcone icon={Briefcase} conectado />,
      href: url,
      display: semProtocolo(url),
    })
  }

  if (perfil.github) {
    const url = `https://github.com/${perfil.github}`
    ids.push({
      key: 'github',
      label: 'GitHub',
      glifo: <GlifoIcone icon={LinkIcon} conectado />,
      href: url,
      display: semProtocolo(url),
    })
  }

  if (perfil.site) {
    const url = perfil.site.startsWith('http') ? perfil.site : `https://${perfil.site}`
    ids.push({
      key: 'site',
      label: 'Site / portfólio',
      glifo: <GlifoIcone icon={Globe} conectado />,
      href: url,
      display: semProtocolo(url),
    })
  }

  return ids
}

/** Lista read-only dos identificadores conectados, ou empty state com CTA. */
export function PerfilIdentificadoresShow({ perfil }: { perfil: Perfil }) {
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
        <li
          key={id.key}
          className="flex min-w-0 items-center gap-3 rounded-lg border bg-muted/20 p-3"
        >
          {id.glifo}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm">{id.label}</div>
            <a
              href={id.href}
              target="_blank"
              rel="noreferrer noopener"
              className="block truncate text-muted-foreground text-xs hover:text-primary hover:underline"
            >
              {id.display}
            </a>
          </div>
          <a
            href={id.href}
            target="_blank"
            rel="noreferrer noopener"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label={`Abrir ${id.label}`}
          >
            <LinkIcon className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  )
}
