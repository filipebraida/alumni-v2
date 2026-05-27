import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

/**
 * Narrow the enum-ish string columns in the generated schema to the PT domain
 * unions defined under #enums. Nullability is appended by the generator.
 */
export default {
  types: {},
  columns: {},
  tables: {
    matriculas: {
      columns: {
        nivel: {
          tsType: 'NivelAcademico',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/nivel_academico', typeImports: ['NivelAcademico'] }],
        },
        campus: {
          tsType: 'Campus',
          decorators: [{ name: '@column' }],
          imports: [{ source: '#enums/campus', typeImports: ['Campus'] }],
        },
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
  },
} satisfies SchemaRules
