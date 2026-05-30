/** Mantém só dígitos e limita a 11 — máximo de um CPF válido. */
export function apenasDigitosCpf(input: string): string {
  return input.replace(/\D/g, '').slice(0, 11)
}

/**
 * Formata um CPF parcial ou completo como `000.000.000-00`. Aceita qualquer
 * lixo (espaços, pontuação) e descarta. Usado em inputs com formatação ao vivo
 * e na exibição de CPFs já gravados.
 */
export function formatarCpf(input: string): string {
  const d = apenasDigitosCpf(input)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}
