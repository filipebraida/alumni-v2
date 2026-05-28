import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import User from '#models/user'
import Egresso from '#models/egresso'
import Curso from '#models/curso'
import Gestor from '#models/gestor'

export default class extends BaseSeeder {
  async run() {
    // Cursos da UFRRJ — âncora dos vínculos e da gestão.
    const computacao = await Curso.updateOrCreate(
      { codigo: 'CCOMP-SRP' },
      {
        codigo: 'CCOMP-SRP',
        nome: 'Ciência da Computação',
        nivel: 'graduacao',
        campus: 'seropedica',
      }
    )

    const informatica = await Curso.updateOrCreate(
      { codigo: 'PPGMC-INFO' },
      {
        codigo: 'PPGMC-INFO',
        nome: 'Informática',
        nivel: 'mestrado',
        campus: 'seropedica',
      }
    )

    // Egressa de teste para o login passwordless e para exercitar o domínio.
    const user = await User.updateOrCreate(
      { email: 'egresso@example.com' },
      { email: 'egresso@example.com', fullName: 'Ana Carolina Silva' }
    )

    const egresso = await Egresso.updateOrCreate(
      { userId: user.id },
      {
        userId: user.id,
        cpf: '12345678900',
        nomeCompleto: 'Ana Carolina Silva',
        emailPessoal: 'ana.silva@example.com',
        // Sem consentimento: primeiro acesso cai no onboarding "É você?".
      }
    )

    // Vínculos acadêmicos: uma graduação e um mestrado (cursos diferentes).
    await egresso.related('matriculas').updateOrCreateMany(
      [
        {
          codigo: '2018212031',
          cursoId: computacao.id,
          periodoFormatura: '2022.2',
          situacao: 'formado',
        },
        {
          codigo: '2023100200',
          cursoId: informatica.id,
          situacao: 'cursando',
        },
      ],
      'codigo'
    )

    // Gestor de teste: coordenação do curso de Ciência da Computação.
    const gestorUser = await User.updateOrCreate(
      { email: 'coordenacao.cc@example.com' },
      { email: 'coordenacao.cc@example.com', fullName: 'Coordenação CC' }
    )

    const gestor = await Gestor.updateOrCreate(
      { userId: gestorUser.id },
      { userId: gestorUser.id, nomeCompleto: 'Coordenação CC', cargo: 'Coordenador' }
    )

    await gestor.related('cursos').sync([computacao.id])

    // Histórico append-only: duas fotos (2023 e 2024). Só semeia se vazio.
    const [{ $extras }] = await egresso.related('respostas').query().count('* as total')
    if (Number($extras.total) === 0) {
      await egresso.related('respostas').createMany([
        {
          ano: 2023,
          localizacaoCidade: 'Seropédica',
          localizacaoUf: 'RJ',
          localizacaoPais: 'Brasil',
          empregador: 'Embrapa Solos',
          cargo: 'Analista',
          setor: 'pesquisa_publica',
          faixaSalarial: 'de_6k_9k',
          relacaoFormacao: 'total',
          tempoPrimeiroEmprego: 'de_3_6m',
          registradaEm: DateTime.fromISO('2023-05-01'),
        },
        {
          ano: 2024,
          localizacaoCidade: 'Rio de Janeiro',
          localizacaoUf: 'RJ',
          localizacaoPais: 'Brasil',
          empregador: 'Stone',
          cargo: 'Engenheira de Software',
          setor: 'privado',
          faixaSalarial: 'de_9k_12k',
          relacaoFormacao: 'total',
          tempoPrimeiroEmprego: 'de_3_6m',
          posGrau: 'mestrado',
          posCurso: 'Informática',
          posInstituicao: 'UFRRJ',
          posStatus: 'cursando',
          registradaEm: DateTime.fromISO('2024-05-01'),
        },
      ])
    }
  }
}
