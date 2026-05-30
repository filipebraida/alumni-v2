import { Transmit } from '@adonisjs/transmit-client'

let singleton: Transmit | null = null

/**
 * UID por aba para o canal SSE. O default do transmit-client usa
 * `crypto.randomUUID()`, que so existe em secure contexts (HTTPS ou localhost);
 * fora disso (HTTP em IP/dominio interno) explode. Esse fallback usa
 * `getRandomValues` (disponivel em qualquer contexto) e cai em `Math.random` se
 * nem isso existir — colisao e irrelevante (so identifica a aba dentro do
 * processo do servidor).
 */
function gerarUid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Retorna o cliente SSE do `@adonisjs/transmit-client`, garantindo que cada
 * aba/janela use UMA conexao SSE (em `/__transmit/events`) compartilhada entre
 * todos os assinantes. Lazy: so abre a conexao na primeira inscricao.
 */
export function getTransmitSingleton(): Transmit {
  if (singleton) return singleton

  singleton = new Transmit({
    baseUrl: window.location.origin,
    uidGenerator: gerarUid,
  })

  return singleton
}
