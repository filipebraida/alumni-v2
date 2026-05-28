import type { HttpContext } from '@adonisjs/core/http'

/**
 * Painel do egresso ("Síntese") — a tela de entrada após o login.
 *
 * Por enquanto serve dados fictícios (espelham o MOCK do design). Quando a
 * camada de dados existir, troque por queries/transformers preservando o
 * mesmo formato de props consumido por `inertia/pages/dashboard.tsx`.
 */
export default class DashboardController {
  async show({ inertia }: HttpContext) {
    return inertia.render('dashboard', {
      egresso: {
        nome: 'Ana Carolina Silva',
        primeiroNome: 'Ana',
        iniciais: 'AC',
        curso: 'Ciência da Computação',
        turma: '2022',
        campus: 'Seropédica',
        saudacao: 'Bom dia',
        agora: 'Terça, 19 maio · 09:24',
        verificada: true,
      },

      frescor: {
        geral: 64,
        expiraEm: '4 meses',
        ultimaRevisao: '8 meses atrás',
      },

      // Espelha a última `resposta` (foto). Campo não informado = valor null.
      camposMec: [
        {
          chave: 'localizacao',
          icone: 'pin',
          rotulo: 'Onde você mora',
          valor: 'Rio de Janeiro · RJ',
        },
        { chave: 'empresa', icone: 'briefcase', rotulo: 'Empresa atual', valor: 'Embrapa Solos' },
        {
          chave: 'cargo',
          icone: 'star',
          rotulo: 'Cargo / função',
          valor: 'Engenheira de Software',
        },
        { chave: 'setor', icone: 'flag', rotulo: 'Setor', valor: 'Pesquisa pública' },
        { chave: 'salario', icone: 'chart', rotulo: 'Faixa salarial', valor: 'R$ 8k — R$ 12k' },
        {
          chave: 'area',
          icone: 'check',
          rotulo: 'Trabalho na sua área?',
          valor: 'Sim, totalmente',
        },
        {
          chave: 'posgrad',
          icone: 'cap',
          rotulo: 'Pós-graduação',
          valor: 'Mestrado em curso · UFRJ',
        },
        { chave: 'primeiroEmprego', icone: 'clock', rotulo: 'Tempo até 1º emprego', valor: null },
      ],

      mapaTurma: {
        mapeados: 34,
        turmaTotal: 47,
        curso: 'Ciência da Computação',
        ano: '2022',
        estados: [
          { uf: 'RJ', nome: 'Rio de Janeiro', total: 18, x: 78, y: 60 },
          { uf: 'SP', nome: 'São Paulo', total: 6, x: 70, y: 65 },
          { uf: 'DF', nome: 'Distrito Federal', total: 3, x: 60, y: 50 },
          { uf: 'MG', nome: 'Minas Gerais', total: 2, x: 72, y: 56 },
          { uf: 'RS', nome: 'Rio Grande do Sul', total: 2, x: 58, y: 82 },
          { uf: 'BA', nome: 'Bahia', total: 1, x: 80, y: 42 },
          { uf: 'EX', nome: 'Exterior', total: 2, x: 18, y: 30 },
        ],
      },

      colegas: {
        total: 38,
        lista: [
          {
            nome: 'Bruno Oliveira',
            iniciais: 'BO',
            cargo: 'Cientista de Dados · iFood',
            cidade: 'São Paulo',
            status: 'ativo',
          },
          {
            nome: 'Camila Ferreira',
            iniciais: 'CF',
            cargo: 'Pesquisadora · Fiocruz',
            cidade: 'Rio de Janeiro',
            status: 'ativo',
          },
          {
            nome: 'Diego Martins',
            iniciais: 'DM',
            cargo: 'Eng. DevOps · Stone',
            cidade: 'Rio de Janeiro',
            status: 'ativo',
          },
          { nome: 'Erika Nunes', iniciais: 'EN', cargo: '—', cidade: '—', status: 'pendente' },
        ],
      },

      carreira: {
        medianaSalarial: 'R$ 9.200',
        suaFaixa: 'R$ 9k — R$ 12k',
        faixas: [
          { rotulo: 'até 3k', pct: 6 },
          { rotulo: '3 — 6k', pct: 18 },
          { rotulo: '6 — 9k', pct: 32 },
          { rotulo: '9 — 12k', pct: 26, destaque: true },
          { rotulo: '12 — 18k', pct: 12 },
          { rotulo: '18k+', pct: 6 },
        ],
        tempoEmprego: {
          mediana: '2,4 meses',
          distribuicao: [
            { rotulo: 'já trabalhava', pct: 28 },
            { rotulo: '< 3 meses', pct: 41 },
            { rotulo: '3 — 6 meses', pct: 18 },
            { rotulo: '6 — 12 meses', pct: 9 },
            { rotulo: '> 12 meses', pct: 4 },
          ],
        },
      },

      experiencias: [
        {
          id: 'e1',
          sigla: 'EM',
          cargo: 'Engenheira de Software',
          org: 'Embrapa Solos',
          inicio: 'Mar 2023',
          fim: 'Atual',
        },
        {
          id: 'e2',
          sigla: 'PR',
          cargo: 'Estagiária de Pesquisa',
          org: 'PoliRural · UFRRJ',
          inicio: 'Jul 2021',
          fim: 'Fev 2023',
        },
        {
          id: 'e3',
          sigla: 'CC',
          cargo: 'Desenvolvedora Júnior',
          org: 'Coopera Cred',
          inicio: 'Jan 2020',
          fim: 'Jul 2021',
        },
      ],
    })
  }
}
