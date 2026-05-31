import vine from '@vinejs/vine'

/**
 * Edição do "Perfil" self-service — role-agnostic. Tudo persiste em `users`.
 * `fullName` é o nome de exibição; campo separado do `egressos.nome_completo`
 * (fonte acadêmica). `fotoUrl` ainda não vem por aqui — upload é outro fluxo.
 */
export const atualizarPerfilValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(180),

    // Identidade visível.
    nomeSocial: vine.string().trim().maxLength(80).nullable().optional(),
    headline: vine.string().trim().maxLength(160).nullable().optional(),
    bio: vine.string().trim().maxLength(280).nullable().optional(),

    // Contato.
    telefone: vine.string().trim().maxLength(32).nullable().optional(),
    cidade: vine.string().trim().maxLength(80).nullable().optional(),
    uf: vine
      .string()
      .trim()
      .fixedLength(2)
      .regex(/^[A-Za-z]{2}$/)
      .nullable()
      .optional(),
    pais: vine.string().trim().maxLength(80).nullable().optional(),

    // Identificadores acadêmicos e redes profissionais.
    lattes: vine.string().trim().maxLength(254).nullable().optional(),
    orcid: vine
      .string()
      .trim()
      .regex(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9X]{4}$/i)
      .nullable()
      .optional(),
    scholar: vine.string().trim().maxLength(254).nullable().optional(),
    linkedin: vine.string().trim().maxLength(80).nullable().optional(),
    github: vine.string().trim().maxLength(80).nullable().optional(),
    site: vine.string().trim().url().maxLength(254).nullable().optional(),

    // Privacidade.
    visEmail: vine.boolean(),
    visMapa: vine.boolean(),
    visEncontrar: vine.boolean(),
  })
)
