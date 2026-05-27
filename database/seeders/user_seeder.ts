import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import User from '#models/user'
import Egresso from '#models/egresso'

export default class extends BaseSeeder {
  async run() {
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
        consentimentoEm: DateTime.now(),
      }
    )

    // Vínculos acadêmicos: uma graduação e um mestrado (níveis diferentes).
    await egresso.related('matriculas').updateOrCreateMany(
      [
        {
          codigo: '2018212031',
          curso: 'Ciência da Computação',
          nivel: 'graduacao',
          campus: 'seropedica',
          periodoFormatura: '2022.2',
          situacao: 'formado',
        },
        {
          codigo: '2023100200',
          curso: 'Informática',
          nivel: 'mestrado',
          campus: 'seropedica',
          situacao: 'cursando',
        },
      ],
      'codigo'
    )

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
