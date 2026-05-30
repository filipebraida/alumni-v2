import vine from '@vinejs/vine'

/**
 * Edição do "Perfil" self-service do egresso. Tudo opcional+nullable (campos
 * em branco viram NULL no banco) menos `nomeCompleto`, que mantém o registro
 * acadêmico vivo. `fotoUrl` fica fora — upload real é outro fluxo (storage +
 * URL assinada); por enquanto a UI guarda só a preview local.
 */
export const atualizarPerfilValidator = vine.compile(
  vine.object({
    nomeCompleto: vine.string().trim().minLength(2).maxLength(180),

    // Identidade visível.
    nomeSocial: vine.string().trim().maxLength(80).nullable().optional(),
    headline: vine.string().trim().maxLength(160).nullable().optional(),
    bio: vine.string().trim().maxLength(280).nullable().optional(),

    // Contato.
    emailPessoal: vine.string().trim().toLowerCase().email().maxLength(254).nullable().optional(),
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
