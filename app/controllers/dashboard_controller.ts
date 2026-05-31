import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

import BuscarEgressoDoUsuario from '#queries/buscar_egresso_do_usuario'
import BuscarUltimaRespostaPessoaDoEgresso from '#queries/buscar_ultima_resposta_pessoa_do_egresso'
import BuscarUltimasRespostasCursoDasMatriculas from '#queries/buscar_ultimas_respostas_curso_das_matriculas'
import EgressoTransformer from '#transformers/egresso_transformer'
import MatriculaTransformer from '#transformers/matricula_transformer'
import {
  calcularFrescor,
  camposDaFormacao,
  camposGeraisDaResposta,
  montarSnapshot,
} from '#services/painel_egresso'

function saudacao(hora: number) {
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

/**
 * Painel do egresso ("Início") — proposta multi-formação. Identidade do
 * egresso e das formações vêm dos transformers (`EgressoTransformer`,
 * `MatriculaTransformer`); a foto MEC (camposGerais + camposMec por formação
 * + frescor + snapshot) vem do `painel_egresso` aplicado à última `Resposta`
 * do egresso. Mapa, colegas e insights agregados ficam em placeholder até
 * existirem queries de turma.
 */
export default class DashboardController {
  async show({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const egresso = await new BuscarEgressoDoUsuario().handle({ userId: user.id })

    // O egresso_middleware garante que chegamos aqui só com vínculo real;
    // o `!` reflete essa invariante sem precisar ramificar a view.
    const todasMatriculas = egresso!.matriculas
    const matriculas = todasMatriculas
      .filter((m) => m.situacao !== 'evadido')
      .sort((a, b) => {
        const ai = (a.dataIngresso ?? a.createdAt).toMillis()
        const bi = (b.dataIngresso ?? b.createdAt).toMillis()
        return ai - bi
      })
    const ancora = matriculas.find((m) => m.curso.nivel === 'graduacao') ?? matriculas[0]
    const agora = DateTime.now().setLocale('pt-BR')

    const ultimaResposta = await new BuscarUltimaRespostaPessoaDoEgresso().handle({
      egressoId: egresso!.id,
    })

    const ultimasRespostasCurso = await new BuscarUltimasRespostasCursoDasMatriculas().handle({
      matriculaIds: matriculas.map((m) => m.id),
    })

    const identidade = new EgressoTransformer(egresso!).toObject()
    const frescor = calcularFrescor(ultimaResposta, agora)

    return inertia.render('dashboard', {
      egresso: {
        ...identidade,
        campus: ancora.curso.instituto?.nome ?? '—',
        saudacao: saudacao(agora.hour),
        agora: agora.toFormat("cccc, d 'de' LLLL · HH:mm"),
      },

      frescor,
      snapshot: montarSnapshot(ultimaResposta, agora),
      camposGerais: camposGeraisDaResposta(ultimaResposta, agora),

      formacoes: matriculas.map((m) => ({
        ...new MatriculaTransformer(m).toObject(),
        // Frescor uniforme nesta entrega — a foto é consolidada na RespostaPessoa.
        frescor: frescor.geral,
        camposMec: camposDaFormacao(
          ultimasRespostasCurso.get(m.id) ?? null,
          ultimaResposta?.registradaEm ?? null,
          m.curso.nivel,
          agora
        ),
      })),
    })
  }
}
