import { type DateTime } from 'luxon'
import type RespostaPessoa from '#models/resposta_pessoa'
import type RespostaCurso from '#models/resposta_curso'
import { type NivelAcademico } from '#enums/nivel_academico'
import { FAIXA_SALARIAL_LABELS } from '#enums/faixa_salarial'
import { RELACAO_FORMACAO_LABELS } from '#enums/relacao_formacao'
import { SETOR_LABELS } from '#enums/setor'
import { TEMPO_PRIMEIRO_EMPREGO_LABELS } from '#enums/tempo_primeiro_emprego'

/**
 * Funções puras que transformam a última `Resposta` do egresso no formato que
 * o painel consome. Centraliza a tradução de enums + mapa de campos MEC e a
 * régua de caducidade (`Resposta.JANELA_FRESCOR_MESES`), pra que o controller
 * fique fino e a página não conheça os labels do domínio.
 */

const JANELA_MESES = 12

type Confianca = 'confirmado' | 'desatualizado' | 'ausente'

export interface CampoMec {
  chave: string
  icone: string
  rotulo: string
  valor: string
  atualizadoEm: string
  confianca: Confianca
}

function idadeMeses(d: DateTime, agora: DateTime): number {
  return Math.floor(agora.diff(d, 'months').months)
}

function rotuloIdade(d: DateTime, agora: DateTime): string {
  const diff = agora.diff(d, ['years', 'months', 'weeks', 'days'])
  if (diff.years >= 1) {
    const y = Math.floor(diff.years)
    return y === 1 ? '1 ano' : `${y} anos`
  }
  if (diff.months >= 1) {
    const m = Math.floor(diff.months)
    return m === 1 ? '1 mês' : `${m} meses`
  }
  const w = Math.max(1, Math.floor(diff.weeks))
  return w === 1 ? '1 sem.' : `${w} sem.`
}

function confianca(valor: string | null | undefined, ageMonths: number): Confianca {
  if (!valor) return 'ausente'
  return ageMonths > JANELA_MESES ? 'desatualizado' : 'confirmado'
}

function montarCampo(args: {
  chave: string
  icone: string
  rotulo: string
  valor: string | null
  registradaEm: DateTime | null
  agora: DateTime
}): CampoMec {
  const ageM = args.registradaEm ? idadeMeses(args.registradaEm, args.agora) : Infinity
  const c = confianca(args.valor, ageM)
  const atualizadoEm =
    args.registradaEm && args.valor ? rotuloIdade(args.registradaEm, args.agora) : '—'
  return {
    chave: args.chave,
    icone: args.icone,
    rotulo: args.rotulo,
    valor: args.valor ?? 'não informado',
    atualizadoEm,
    confianca: c,
  }
}

/** 4 cards compartilhados — valem pra todas as formações do egresso. */
export function camposGeraisDaResposta(r: RespostaPessoa | null, agora: DateTime): CampoMec[] {
  const reg = r?.registradaEm ?? null
  const local =
    r &&
    ([r.localizacaoCidade, r.localizacaoUf, r.localizacaoPais].filter(Boolean).join(' · ') || null)

  return [
    montarCampo({
      chave: 'localizacao',
      icone: 'pin',
      rotulo: 'Onde você mora',
      valor: local ?? null,
      registradaEm: reg,
      agora,
    }),
    montarCampo({
      chave: 'empresa',
      icone: 'briefcase',
      rotulo: 'Empresa atual',
      valor: r?.empregador ?? null,
      registradaEm: reg,
      agora,
    }),
    montarCampo({
      chave: 'cargo',
      icone: 'star',
      rotulo: 'Cargo / função',
      valor: r?.cargo ?? null,
      registradaEm: reg,
      agora,
    }),
    montarCampo({
      chave: 'setor',
      icone: 'flag',
      rotulo: 'Setor',
      valor: r?.setor ? SETOR_LABELS[r.setor] : null,
      registradaEm: reg,
      agora,
    }),
  ]
}

/**
 * Campos MEC específicos da formação. Hoje só graduação tem mapeamento real
 * (salário, relação com a formação, tempo até 1º emprego), lidos da
 * `RespostaCurso` da matrícula. Pós-graduação fica vazia (identidade-só nesta
 * entrega) — a view exibe "Campos da formação chegam em breve".
 *
 * `r` (RespostaCurso) é a foto mais recente da matrícula em questão; o
 * timestamp pra cálculo de confiança vem da `RespostaPessoa` mãe (uniforme
 * pra toda a foto consolidada).
 */
export function camposDaFormacao(
  r: RespostaCurso | null,
  registradaEm: DateTime | null,
  nivel: NivelAcademico,
  agora: DateTime
): CampoMec[] {
  if (nivel !== 'graduacao') return []

  return [
    montarCampo({
      chave: 'salario',
      icone: 'chart',
      rotulo: 'Faixa salarial',
      valor: r?.faixaSalarial ? FAIXA_SALARIAL_LABELS[r.faixaSalarial] : null,
      registradaEm,
      agora,
    }),
    montarCampo({
      chave: 'area',
      icone: 'check',
      rotulo: 'Atua na área formada?',
      valor: r?.relacaoFormacao ? RELACAO_FORMACAO_LABELS[r.relacaoFormacao] : null,
      registradaEm,
      agora,
    }),
    montarCampo({
      chave: 'primeiroEmprego',
      icone: 'clock',
      rotulo: 'Tempo até 1º emprego',
      valor: r?.tempoPrimeiroEmprego ? TEMPO_PRIMEIRO_EMPREGO_LABELS[r.tempoPrimeiroEmprego] : null,
      registradaEm,
      agora,
    }),
  ]
}

/** % de frescor da última resposta + quanto tempo até expirar. */
export function calcularFrescor(r: RespostaPessoa | null, agora: DateTime) {
  if (!r) return { geral: 0, expiraEm: '—', ultimaRevisao: 'nunca' }
  const ageM = idadeMeses(r.registradaEm, agora)
  const restantes = JANELA_MESES - ageM
  const pct = Math.max(0, Math.min(100, Math.round((restantes / JANELA_MESES) * 100)))
  const expiraEm = restantes <= 0 ? 'expirado' : restantes === 1 ? '1 mês' : `${restantes} meses`
  return {
    geral: pct,
    expiraEm,
    ultimaRevisao: rotuloIdade(r.registradaEm, agora),
  }
}

/** Quando a foto atual foi registrada — pra barra sticky de confirmar tudo. */
export function montarSnapshot(r: RespostaPessoa | null, agora: DateTime) {
  return {
    hoje: agora.toFormat("d 'de' LLLL yyyy"),
    ultimaFoto: r ? r.registradaEm.setLocale('pt-BR').toFormat("d 'de' LLLL yyyy") : '—',
  }
}
