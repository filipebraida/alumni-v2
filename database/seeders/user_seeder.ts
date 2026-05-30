import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Curso from '#models/curso'
import Gestor from '#models/gestor'
import Instituto from '#models/instituto'

const INSTITUTOS = [
  { codigo: 'IA', nome: 'Instituto de Agronomia' },
  { codigo: 'ICBS', nome: 'Instituto de Ciências Biológicas e da Saúde' },
  { codigo: 'ICE', nome: 'Instituto de Ciências Exatas' },
  { codigo: 'ICHS', nome: 'Instituto de Ciências Humanas e Sociais' },
  { codigo: 'ICSA', nome: 'Instituto de Ciências Sociais Aplicadas' },
  { codigo: 'IE', nome: 'Instituto de Educação' },
  { codigo: 'IF', nome: 'Instituto de Florestas' },
  { codigo: 'IT', nome: 'Instituto de Tecnologia' },
  { codigo: 'IV', nome: 'Instituto de Veterinária' },
  { codigo: 'IZ', nome: 'Instituto de Zootecnia' },
  { codigo: 'IM', nome: 'Instituto Multidisciplinar' },
  { codigo: 'ITR', nome: 'Instituto Três Rios' },
] as const

export default class extends BaseSeeder {
  async run() {
    for (const instituto of INSTITUTOS) {
      await Instituto.updateOrCreate(
        { codigo: instituto.codigo },
        { codigo: instituto.codigo, nome: instituto.nome, ativo: true }
      )
    }

    const im = await Instituto.findByOrFail('codigo', 'IM')

    const computacao = await Curso.updateOrCreate(
      { codigo: 'CCOMP' },
      {
        codigo: 'CCOMP',
        nome: 'Ciência da Computação',
        nivel: 'graduacao',
        institutoId: im.id,
      }
    )

    await User.updateOrCreate(
      { email: 'filipebraida@ufrrj.br' },
      { email: 'filipebraida@ufrrj.br', fullName: 'Filipe Braida', role: 'admin' }
    )

    const julianaUser = await User.updateOrCreate(
      { email: 'juliananascente@ufrrj.br' },
      { email: 'juliananascente@ufrrj.br', fullName: 'Juliana Nascente' }
    )
    const juliana = await Gestor.updateOrCreate(
      { userId: julianaUser.id },
      { userId: julianaUser.id, nomeCompleto: 'Juliana Nascente', cargo: 'Coordenadora' }
    )
    await juliana.related('cursos').sync([computacao.id])
  }
}
