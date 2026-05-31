import type Matricula from '#models/matricula'
import { BaseTransformer } from '@adonisjs/core/transformers'
import { NIVEL_LABELS } from '#enums/nivel_academico'
import CampoMecTransformer, { type CampoMec } from '#transformers/campo_mec_transformer'

export type MatriculaPainelExtras = {
  frescor: number
  camposMec: CampoMec[]
}

export default class MatriculaTransformer extends BaseTransformer<Matricula> {
  constructor(
    resource: Matricula,
    protected painelExtras?: Map<number, MatriculaPainelExtras>
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
    const extras = this.painelExtras?.get(this.resource.id)
    if (!extras) {
      throw new Error(
        `MatriculaTransformer.forPainel: faltam extras para matrícula ${this.resource.id}`
      )
    }
    return {
      ...this.toObject(),
      frescor: extras.frescor,
      camposMec: CampoMecTransformer.transform(extras.camposMec),
    }
  }
}
