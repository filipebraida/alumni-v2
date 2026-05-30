import { Transmit } from '@adonisjs/transmit-client'

let singleton: Transmit | null = null

/**
 * Retorna o cliente SSE do `@adonisjs/transmit-client`, garantindo que cada
 * aba/janela use UMA conexao SSE (em `/__transmit/events`) compartilhada entre
 * todos os assinantes. Lazy: so abre a conexao na primeira inscricao.
 */
export function getTransmitSingleton(): Transmit {
  if (singleton) return singleton

  singleton = new Transmit({
    baseUrl: window.location.origin,
  })

  return singleton
}
