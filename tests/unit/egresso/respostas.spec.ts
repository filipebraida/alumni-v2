import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

import User from '#models/user'
import Egresso from '#models/egresso'
import Curso from '#models/curso'
import Instituto from '#models/instituto'
import RegistrarResposta from '#actions/registrar_resposta'
import BuscarRespostaAtual from '#queries/buscar_resposta_atual'
import BuscarRespostaDoAno from '#queries/buscar_resposta_do_ano'
import ListarRespostas from '#queries/listar_respostas'

let contador = 0
async function criarEgresso() {
  contador += 1
  const sufixo = `${contador}-${Date.now()}`
  const user = await User.create({ email: `egresso-${sufixo}@example.com`, fullName: 'Teste' })
  return Egresso.create({ userId: user.id, cpf: `cpf-${sufixo}`, nomeCompleto: 'Teste' })
}

test.group('Egresso · respostas (append-only)', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('cada registro vira uma linha nova — não sobrescreve', async ({ assert }) => {
    const egresso = await criarEgresso()
    await new RegistrarResposta().handle({
      egressoId: egresso.id,
      ano: 2024,
      empregador: 'Empresa A',
    })
    await new RegistrarResposta().handle({
      egressoId: egresso.id,
      ano: 2024,
      empregador: 'Empresa B',
    })

    const todas = await new ListarRespostas().handle({ egressoId: egresso.id })
    assert.lengthOf(todas, 2)
  })

  test('estado atual = a resposta mais recente', async ({ assert }) => {
    const egresso = await criarEgresso()
    await new RegistrarResposta().handle({
      egressoId: egresso.id,
      ano: 2024,
      empregador: 'Empresa A',
    })
    await new RegistrarResposta().handle({
      egressoId: egresso.id,
      ano: 2024,
      empregador: 'Empresa B',
    })

    const atual = await new BuscarRespostaAtual().handle({ egressoId: egresso.id })
    assert.equal(atual?.empregador, 'Empresa B')
  })

  test('foto do ano = a resposta daquele ano de referência', async ({ assert }) => {
    const egresso = await criarEgresso()
    await new RegistrarResposta().handle({ egressoId: egresso.id, ano: 2023, empregador: 'Antigo' })
    await new RegistrarResposta().handle({ egressoId: egresso.id, ano: 2024, empregador: 'Novo' })

    const r2023 = await new BuscarRespostaDoAno().handle({ egressoId: egresso.id, ano: 2023 })
    const r2024 = await new BuscarRespostaDoAno().handle({ egressoId: egresso.id, ano: 2024 })
    assert.equal(r2023?.empregador, 'Antigo')
    assert.equal(r2024?.empregador, 'Novo')
  })

  test('ano padrão é o ano atual', async ({ assert }) => {
    const egresso = await criarEgresso()
    const resposta = await new RegistrarResposta().handle({
      egressoId: egresso.id,
      empregador: 'X',
    })
    assert.equal(resposta.ano, DateTime.now().year)
  })

  test('uma pessoa pode ter vários cursos (níveis diferentes)', async ({ assert }) => {
    const egresso = await criarEgresso()
    const sufixo = `${contador}-${Date.now()}`

    const instituto = await Instituto.create({
      codigo: `inst-${sufixo}`,
      nome: 'Instituto de teste',
    })
    const graduacao = await Curso.create({
      codigo: `grad-${sufixo}`,
      nome: 'Ciência da Computação',
      nivel: 'graduacao',
      institutoId: instituto.id,
    })
    const mestrado = await Curso.create({
      codigo: `mest-${sufixo}`,
      nome: 'Informática',
      nivel: 'mestrado',
      institutoId: instituto.id,
    })

    await egresso.related('matriculas').createMany([
      { codigo: `m-grad-${sufixo}`, cursoId: graduacao.id, situacao: 'formado' },
      { codigo: `m-mest-${sufixo}`, cursoId: mestrado.id, situacao: 'cursando' },
    ])

    await egresso.load('matriculas', (matriculas) => matriculas.preload('curso'))
    assert.lengthOf(egresso.matriculas, 2)
    assert.sameMembers(
      egresso.matriculas.map((m) => m.curso.nivel),
      ['graduacao', 'mestrado']
    )
  })
})
