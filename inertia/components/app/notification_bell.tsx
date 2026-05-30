import { router, usePage } from '@inertiajs/react'
import { Bell, CheckCheck } from 'lucide-react'
import { useCallback, useState } from 'react'

import type { InertiaProps } from '~/types'

import { urlFor } from '~/client'

import { useNotificationsChannel } from '~/hooks/use_notifications_channel'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Spinner } from '~/components/ui/spinner'

import { cn } from '~/lib/utils'

interface NotificationContent {
  title?: string
  body?: string
  [key: string]: unknown
}

interface NotificationItem {
  id: number
  type: string
  content: NotificationContent
  status: 'unseen' | 'seen' | 'read'
  tags: string[] | null
  readAt: string | null
  seenAt: string | null
  createdAt: string
}

interface ListResponse {
  itens: NotificationItem[]
  naoVistas: number
}

/**
 * Sino de notificacoes do header: badge com contador, popover com a lista das
 * 20 mais recentes, marcar-como-lida ao clicar e marcar-tudo-visto ao abrir.
 *
 * - O contador (badge) usa a shared prop `unseenNotificationsCount` ate o
 *   primeiro fetch; depois do fetch sincroniza com o servidor.
 * - O canal SSE pessoal dispara um `reload` da shared prop quando chega algo
 *   novo (e refaz o fetch se o popover ja estiver aberto).
 */
export function NotificationBell() {
  const props = usePage<InertiaProps>().props
  const userId = props.user?.id
  const csrfToken = props.csrf

  const [open, setOpen] = useState(false)
  const [itens, setItens] = useState<NotificationItem[]>([])
  const [carregando, setCarregando] = useState(false)
  const [naoVistasLocal, setNaoVistasLocal] = useState<number | null>(null)

  const naoVistas = naoVistasLocal ?? props.unseenNotificationsCount ?? 0
  const temNaoLidas = itens.some((item) => item.status !== 'read')

  const buscar = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch(urlFor('notificacoes.index'), {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
      })
      if (!res.ok) return
      const data: ListResponse = await res.json()
      setItens(data.itens)
    } finally {
      setCarregando(false)
    }
  }, [])

  const marcarTudoVisto = useCallback(async () => {
    await fetch(urlFor('notificacoes.visualizar'), {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
      credentials: 'same-origin',
    })
    setNaoVistasLocal(0)
    router.reload({ only: ['unseenNotificationsCount'], async: true })
  }, [csrfToken])

  const marcarTudoLido = useCallback(async () => {
    await fetch(urlFor('notificacoes.ler_todas'), {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
      credentials: 'same-origin',
    })
    const agora = new Date().toISOString()
    setItens((anterior) => anterior.map((item) => ({ ...item, status: 'read', readAt: agora })))
    setNaoVistasLocal(0)
    router.reload({ only: ['unseenNotificationsCount'], async: true })
  }, [csrfToken])

  const aoMudarAbertura = (proximo: boolean) => {
    setOpen(proximo)
    if (!proximo) return
    void buscar()
    if (naoVistas > 0) void marcarTudoVisto()
  }

  const aoChegarNotificacao = useCallback(() => {
    setNaoVistasLocal(null)
    router.reload({ only: ['unseenNotificationsCount'], async: true })
    if (open) void buscar()
  }, [open, buscar])

  useNotificationsChannel(userId, aoChegarNotificacao)

  const aoClicarItem = async (item: NotificationItem) => {
    if (item.status === 'read') return

    void fetch(urlFor('notificacoes.ler', { id: item.id }), {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
      credentials: 'same-origin',
    })

    const agora = new Date().toISOString()
    setItens((anterior) =>
      anterior.map((n) => (n.id === item.id ? { ...n, status: 'read', readAt: agora } : n))
    )
  }

  return (
    <Popover open={open} onOpenChange={aoMudarAbertura}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificações" />
        }
      >
        <Bell />
        {naoVistas > 0 && (
          <Badge
            variant="destructive"
            size="sm"
            className="-top-1 -right-1 absolute h-4 min-w-4 px-1 tabular-nums"
          >
            {naoVistas > 9 ? '9+' : naoVistas}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold text-sm">Notificações</span>
          {temNaoLidas && (
            <Button variant="ghost" size="xs" className="gap-1 text-xs" onClick={marcarTudoLido}>
              <CheckCheck />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto overscroll-contain">
          {carregando && itens.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : itens.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              Você não tem notificações.
            </div>
          ) : (
            <ul className="divide-y">
              {itens.map((item) => (
                <NotificationItemRow key={item.id} item={item} onClick={aoClicarItem} />
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItemRow({
  item,
  onClick,
}: {
  item: NotificationItem
  onClick: (item: NotificationItem) => void
}) {
  const naoLida = item.status !== 'read'

  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(item)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
      >
        <span
          aria-hidden
          className={cn(
            'mt-1.5 size-2 shrink-0 rounded-full',
            naoLida ? 'bg-primary' : 'bg-transparent'
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="break-words font-medium text-sm leading-snug">
            {item.content.title ?? item.type}
          </p>
          {item.content.body && (
            <p className="mt-0.5 break-words text-muted-foreground text-xs leading-snug">
              {item.content.body}
            </p>
          )}
          <p className="mt-1 text-muted-foreground/70 text-xs">
            {formatarRelativo(item.createdAt)}
          </p>
        </div>
      </button>
    </li>
  )
}

const UNIDADES: { unidade: Intl.RelativeTimeFormatUnit; segundos: number }[] = [
  { unidade: 'year', segundos: 60 * 60 * 24 * 365 },
  { unidade: 'month', segundos: 60 * 60 * 24 * 30 },
  { unidade: 'day', segundos: 60 * 60 * 24 },
  { unidade: 'hour', segundos: 60 * 60 },
  { unidade: 'minute', segundos: 60 },
  { unidade: 'second', segundos: 1 },
]

function formatarRelativo(iso: string) {
  const formatador = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
  const diff = (new Date(iso).getTime() - Date.now()) / 1000

  for (const { unidade, segundos } of UNIDADES) {
    if (Math.abs(diff) >= segundos || unidade === 'second') {
      return formatador.format(Math.round(diff / segundos), unidade)
    }
  }
  return ''
}
