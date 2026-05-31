import type { HttpContext } from '@adonisjs/core/http'

/**
 * Painel do egresso ("Início") — proposta multi-formação. Um egresso pode ter
 * 1+ vínculo com a UFRRJ; aqui devolvemos "dados gerais" (valem pra todas) e
 * uma lista de formações com turma/colegas/insights próprios. Por enquanto
 * serve mock fictício; quando a camada de dados existir, trocar por queries
 * preservando o formato consumido por `inertia/pages/dashboard.tsx`.
 */
export default class DashboardController {
  async show({ inertia }: HttpContext) {
    return inertia.render('dashboard', {
      egresso: {
        nome: 'Ana Carolina Silva',
        primeiroNome: 'Ana',
        iniciais: 'AC',
        campus: 'Seropédica',
        saudacao: 'Bom dia',
        agora: 'Terça, 19 maio · 09:24',
        verificada: true,
      },

      frescor: {
        geral: 58,
        expiraEm: '4 meses',
        ultimaRevisao: '8 meses atrás',
      },

      snapshot: {
        hoje: '19 maio 2026',
        ultimaFoto: '12 set 2025',
      },

      camposGerais: [
        {
          chave: 'localizacao',
          icone: 'pin',
          rotulo: 'Onde você mora',
          valor: 'Rio de Janeiro · RJ',
          atualizadoEm: '3 sem.',
          confianca: 'confirmado',
        },
        {
          chave: 'empresa',
          icone: 'briefcase',
          rotulo: 'Empresa atual',
          valor: 'Embrapa Solos',
          atualizadoEm: '2 meses',
          confianca: 'confirmado',
        },
        {
          chave: 'cargo',
          icone: 'star',
          rotulo: 'Cargo / função',
          valor: 'Engenheira de Software',
          atualizadoEm: '2 meses',
          confianca: 'confirmado',
        },
        {
          chave: 'setor',
          icone: 'flag',
          rotulo: 'Setor',
          valor: 'Pesquisa pública',
          atualizadoEm: '2 meses',
          confianca: 'desatualizado',
        },
      ],

      formacoes: [
        {
          id: 'grad-cc',
          nivel: 'Graduação',
          diploma: 'Bacharelado em Ciência da Computação',
          curto: 'Ciência da Computação',
          campus: 'Seropédica',
          rotuloTurma: 'Turma 2022',
          periodo: '2018 — 2022',
          status: 'concluido',
          frescor: 72,
          camposMec: [
            {
              chave: 'salario',
              icone: 'chart',
              rotulo: 'Faixa salarial',
              valor: 'R$ 8k — R$ 12k',
              atualizadoEm: '1 ano',
              confianca: 'desatualizado',
            },
            {
              chave: 'area',
              icone: 'check',
              rotulo: 'Atua na área formada?',
              valor: 'Sim, totalmente',
              atualizadoEm: '11 meses',
              confianca: 'desatualizado',
            },
            {
              chave: 'primeiroEmprego',
              icone: 'clock',
              rotulo: 'Tempo até 1º emprego',
              valor: 'não informado',
              atualizadoEm: '—',
              confianca: 'ausente',
            },
          ],
          mapa: {
            mapeados: 34,
            turmaTotal: 47,
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
          totalColegas: 38,
          colegas: [
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
          ],
          insight: {
            tipo: 'salario',
            mediana: 'R$ 9.200',
            suaFaixa: 'R$ 9k — R$ 12k',
            faixas: [
              { rotulo: 'até 3k', pct: 6 },
              { rotulo: '3 — 6k', pct: 18 },
              { rotulo: '6 — 9k', pct: 32 },
              { rotulo: '9 — 12k', pct: 26, destaque: true },
              { rotulo: '12 — 18k', pct: 12 },
              { rotulo: '18k+', pct: 6 },
            ],
            ladoTitulo: 'Tempo até o 1º emprego',
            ladoMediana: '2,4 meses',
            ladoDistribuicao: [
              { rotulo: 'já trabalhava', pct: 28 },
              { rotulo: '< 3 meses', pct: 41, destaque: true },
              { rotulo: '3 — 6 meses', pct: 18 },
              { rotulo: '6 — 12 meses', pct: 9 },
              { rotulo: '> 12 meses', pct: 4 },
            ],
            ladoEgresso: 'Você ainda não informou',
          },
        },
        {
          id: 'mest-ppgmmc',
          nivel: 'Pós-graduação',
          diploma: 'Mestrado em Modelagem Matemática e Computacional',
          curto: 'Mestrado · PPGMMC',
          campus: 'Seropédica',
          rotuloTurma: 'Ingresso 2024',
          periodo: '2024 — atual',
          status: 'em_curso',
          frescor: 40,
          camposMec: [
            {
              chave: 'bolsa',
              icone: 'award',
              rotulo: 'Bolsa / vínculo',
              valor: 'CAPES · DS',
              atualizadoEm: '4 meses',
              confianca: 'confirmado',
            },
            {
              chave: 'linha',
              icone: 'book',
              rotulo: 'Linha de pesquisa',
              valor: 'Geoprocessamento',
              atualizadoEm: '5 meses',
              confianca: 'confirmado',
            },
            {
              chave: 'defesa',
              icone: 'calendar',
              rotulo: 'Previsão de defesa',
              valor: 'não informado',
              atualizadoEm: '—',
              confianca: 'ausente',
            },
          ],
          mapa: {
            mapeados: 9,
            turmaTotal: 14,
            estados: [
              { uf: 'RJ', nome: 'Rio de Janeiro', total: 6, x: 78, y: 60 },
              { uf: 'MG', nome: 'Minas Gerais', total: 1, x: 72, y: 56 },
              { uf: 'SP', nome: 'São Paulo', total: 1, x: 70, y: 65 },
              { uf: 'ES', nome: 'Espírito Santo', total: 1, x: 82, y: 54 },
            ],
          },
          totalColegas: 13,
          colegas: [
            {
              nome: 'Helena Castro',
              iniciais: 'HC',
              cargo: 'Mestranda · PPGMMC',
              cidade: 'Seropédica',
              status: 'ativo',
            },
            {
              nome: 'Igor Almeida',
              iniciais: 'IA',
              cargo: 'Analista · INEA',
              cidade: 'Rio de Janeiro',
              status: 'ativo',
            },
            {
              nome: 'João Pedro Reis',
              iniciais: 'JR',
              cargo: '—',
              cidade: '—',
              status: 'pendente',
            },
          ],
          insight: {
            tipo: 'situacao',
            resumo: '14 mestrandos · ingresso 2024',
            distribuicao: [
              { rotulo: 'Em disciplinas', pct: 50, destaque: true },
              { rotulo: 'Qualificaram', pct: 29 },
              { rotulo: 'Projeto submetido', pct: 14 },
              { rotulo: 'Defenderam', pct: 7 },
            ],
            ladoTitulo: 'Linhas de pesquisa da turma',
            ladoMediana: '5 linhas ativas',
            ladoDistribuicao: [
              { rotulo: 'Geoprocessamento', pct: 36, destaque: true },
              { rotulo: 'Otimização', pct: 21 },
              { rotulo: 'Modelagem ambiental', pct: 21 },
              { rotulo: 'IA aplicada', pct: 14 },
              { rotulo: 'Bioestatística', pct: 8 },
            ],
            ladoEgresso: 'Sua linha: Geoprocessamento',
          },
        },
      ],
    })
  }
}
