import vine from '@vinejs/vine'

/**
 * Edição do "Meu perfil" do egresso. Por enquanto persiste apenas nome
 * completo e e-mail alternativo — os demais campos do mock (bio, telefone,
 * ORCID, Lattes, etc.) ainda não têm coluna no schema e vivem só na UI.
 */
export const atualizarPerfilValidator = vine.compile(
  vine.object({
    nomeCompleto: vine.string().trim().minLength(2).maxLength(180),
    emailPessoal: vine.string().trim().toLowerCase().email().maxLength(254).optional().nullable(),
  })
)
