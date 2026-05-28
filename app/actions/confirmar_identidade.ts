import { DateTime } from 'luxon'
import type Egresso from '#models/egresso'

/**
 * "Sou eu" no onboarding: registra o consentimento (LGPD) do egresso. Idempotente
 * — não sobrescreve um consentimento já dado.
 */
export default class ConfirmarIdentidade {
  async handle(egresso: Egresso): Promise<void> {
    if (egresso.consentimentoEm) return
    egresso.consentimentoEm = DateTime.now()
    await egresso.save()
  }
}
