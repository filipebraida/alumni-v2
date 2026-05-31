import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

/**
 * Narrow the enum-ish string columns in the generated schema to the PT domain
 * unions defined under #enums. Nullability is appended by the generator.
 */
export default {
  types: {},
  columns: {},
  tables: {
    cursos: {
      columns: {
        nivel: {
          tsType: 'NivelAcademico',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/nivel_academico', typeImports: ['NivelAcademico'] }],
        },
      },
    },
    programas: {
      columns: {
        modalidade: {
          tsType: 'ModalidadePrograma',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/modalidade_programa', typeImports: ['ModalidadePrograma'] }],
        },
      },
    },
    matriculas: {
      columns: {
        situacao: {
          tsType: 'SituacaoMatricula',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/situacao_matricula', typeImports: ['SituacaoMatricula'] }],
        },
      },
    },
    respostas: {
      columns: {
        setor: {
          tsType: 'Setor',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/setor', typeImports: ['Setor'] }],
        },
        faixa_salarial: {
          tsType: 'FaixaSalarial',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/faixa_salarial', typeImports: ['FaixaSalarial'] }],
        },
        relacao_formacao: {
          tsType: 'RelacaoFormacao',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/relacao_formacao', typeImports: ['RelacaoFormacao'] }],
        },
        tempo_primeiro_emprego: {
          tsType: 'TempoPrimeiroEmprego',
          decorators: [{ name: '@column' }],
          imports: [
            { source: '#enums/tempo_primeiro_emprego', typeImports: ['TempoPrimeiroEmprego'] },
          ],
        },
        pos_grau: {
          tsType: 'NivelPos',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/nivel_academico', typeImports: ['NivelPos'] }],
        },
        pos_status: {
          tsType: 'StatusPos',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/status_pos', typeImports: ['StatusPos'] }],
        },
      },
    },
    users: {
      columns: {
        role: {
          tsType: 'RoleUsuario',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/role_usuario', typeImports: ['RoleUsuario'] }],
        },
      },
    },
    // Notificacoes: `content` e `tags` sao JSON em colunas TEXT (gravadas pelo
    // canal `database` do facteur via knex bruto). Pulamos as colunas no
    // schema gerado e re-definimos com `prepare`/`consume` no #models/notification.
    notifications: {
      skipColumns: ['content', 'tags'],
      columns: {
        status: {
          tsType: 'NotificationStatus',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#models/notification', typeImports: ['NotificationStatus'] }],
        },
      },
    },
  },
} satisfies SchemaRules
