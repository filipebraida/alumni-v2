import { test } from '@japa/runner'
import { DateTime } from 'luxon'

import RespostaPessoa from '#models/resposta_pessoa'
import { calcularFrescor } from '#services/painel_egresso'

const AGORA = DateTime.fromISO('2026-05-31', { zone: 'utc' })

type Linha = {
  rotulo: string
  registradaEm: DateTime | null
  esperado: { geral: number; expiraEm: string; ultimaRevisao: string }
}

function comRegistradaEm(d: DateTime | null): RespostaPessoa | null {
  if (!d) return null
  const r = new RespostaPessoa()
  r.registradaEm = d
  return r
}

const DATASET: Linha[] = [
  {
    rotulo: '0 dias atrás → 100% · expira em 12 meses',
    registradaEm: AGORA,
    esperado: { geral: 100, expiraEm: '12 meses', ultimaRevisao: '1 sem.' },
  },
  {
    rotulo: '6 meses atrás → 50% · expira em 6 meses',
    registradaEm: AGORA.minus({ months: 6 }),
    esperado: { geral: 50, expiraEm: '6 meses', ultimaRevisao: '6 meses' },
  },
  {
    rotulo: '12 meses atrás → 0% · expirado',
    registradaEm: AGORA.minus({ months: 12 }),
    esperado: { geral: 0, expiraEm: 'expirado', ultimaRevisao: '1 ano' },
  },
  {
    rotulo: '13 meses atrás → 0% · expirado',
    registradaEm: AGORA.minus({ months: 13 }),
    esperado: { geral: 0, expiraEm: 'expirado', ultimaRevisao: '1 ano' },
  },
  {
    rotulo: 'sem RespostaPessoa → 0% · "—" · "nunca"',
    registradaEm: null,
    esperado: { geral: 0, expiraEm: '—', ultimaRevisao: 'nunca' },
  },
]

test.group('painel_egresso · calcularFrescor', () => {
  test('{rotulo}')
    .with(DATASET)
    .run(({ assert }, linha) => {
      const resultado = calcularFrescor(comRegistradaEm(linha.registradaEm), AGORA)
      assert.equal(resultado.geral, linha.esperado.geral, 'geral')
      assert.equal(resultado.expiraEm, linha.esperado.expiraEm, 'expiraEm')
      assert.equal(resultado.ultimaRevisao, linha.esperado.ultimaRevisao, 'ultimaRevisao')
    })
})
