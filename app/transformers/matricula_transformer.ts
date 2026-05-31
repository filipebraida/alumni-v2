import type Matricula from '#models/matricula'
import type RespostaCurso from '#models/resposta_curso'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { NIVEL_LABELS } from '#enums/nivel_academico'
import { type CampoMec } from '#services/painel_egresso'
import RespostaCursoTransformer from '#transformers/resposta_curso_transformer'

export type MatriculaPainelExtras = {
  frescor: number
  camposMec: CampoMec[]
}

export type MatriculaExtras = {
  painel?: Map<number, MatriculaPainelExtras>
  revisao?: Map<number, RespostaCurso>
}

export default class MatriculaTransformer extends BaseTransformer<Matricula> {
  constructor(
    resource: Matricula,
    protected extras?: MatriculaExtras
  ) {
    super(resource)
  }

  toObject() {
    const m = this.resource
    const concluida = m.situacao === 'formado'

    return {
      id: m.id,
      codigo: m.codigo,
      nivel: NIVEL_LABELS[m.curso.nivel],
      diploma: m.curso.nome,
      curto: m.curso.nome,
      campus: m.curso.instituto?.nome ?? '—',
      rotuloTurma: concluida ? `Turma ${m.periodoFormatura ?? '—'}` : 'Em curso',
      periodo: m.periodoFormatura ?? '—',
      status: concluida ? ('concluido' as const) : ('em_curso' as const),
    }
  }

  forPainel() {
    const painel = this.extras?.painel?.get(this.resource.id)
    if (!painel) {
      throw new Error(
        `MatriculaTransformer.forPainel: faltam extras para matrícula ${this.resource.id}`
      )
    }
    return {
      ...this.toObject(),
      frescor: painel.frescor,
      camposMec: painel.camposMec,
    }
  }

  forRevisao() {
    const rc = this.extras?.revisao?.get(this.resource.id)
    return {
      id: this.resource.id,
      curto: this.resource.curso.nome,
      ehGraduacao: this.resource.curso.nivel === 'graduacao',
      valoresAtuais: rc ? RespostaCursoTransformer.transform(rc) : null,
    }
  }

  forPerfil() {
    const m = this.resource
    return {
      id: m.id,
      nivel: NIVEL_LABELS[m.curso.nivel],
      curso: m.curso.nome,
      instituto: m.curso.instituto?.nome ?? '—',
      codigo: m.codigo,
      periodoFormatura: m.periodoFormatura,
      situacao: m.situacao,
    }
  }
}
