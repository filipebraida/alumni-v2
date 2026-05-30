import Egresso from '#models/egresso'

export interface BuscarEgressoPorCpfInput {
  cpf: string
  cursoAtivoId: number
}

export type BuscarEgressoPorCpfResult =
  | { status: 'nao_encontrado' }
  | {
      status: 'fora_do_curso'
      egresso: { id: number; nome: string }
      outrosCursos: number
    }
  | {
      status: 'ja_no_curso'
      egresso: { id: number; nome: string }
      matricula: { codigo: string; situacao: string; periodoFormatura: string | null }
    }

/**
 * Lookup de egresso por CPF para o cadastro manual da gestão. Resolve três
 * estados que dirigem a UI do dialog: não existe (form completo), existe fora
 * do curso ativo (form-light de vínculo) e já está neste curso (info + voltar).
 * Privacidade: nunca devolve o nome de outro curso — só a contagem agregada.
 */
export default class BuscarEgressoPorCpf {
  async handle({
    cpf,
    cursoAtivoId,
  }: BuscarEgressoPorCpfInput): Promise<BuscarEgressoPorCpfResult> {
    const cpfNormalizado = cpf.replace(/\D/g, '')

    const egresso = await Egresso.query().where('cpf', cpfNormalizado).preload('matriculas').first()

    if (!egresso) {
      return { status: 'nao_encontrado' }
    }

    const matriculaNoCurso = egresso.matriculas.find((m) => m.cursoId === cursoAtivoId)
    if (matriculaNoCurso) {
      return {
        status: 'ja_no_curso',
        egresso: { id: egresso.id, nome: egresso.nomeCompleto },
        matricula: {
          codigo: matriculaNoCurso.codigo,
          situacao: matriculaNoCurso.situacao,
          periodoFormatura: matriculaNoCurso.periodoFormatura,
        },
      }
    }

    return {
      status: 'fora_do_curso',
      egresso: { id: egresso.id, nome: egresso.nomeCompleto },
      outrosCursos: egresso.matriculas.length,
    }
  }
}
