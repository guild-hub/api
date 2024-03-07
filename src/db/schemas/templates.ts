import { relations } from 'drizzle-orm'
import { blob, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { guilds } from '$/db/schemas/guilds'

import { MAXIMUM_NAME_LENGTH, UUID_LENGTH } from '$/lib/constants'
import { dateFn, uuidFn } from '$/lib/utils'

export const templates = sqliteTable(
	'template',
	{
		id: text('id', { length: UUID_LENGTH }).primaryKey().$defaultFn(uuidFn),
		guildId: blob('guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		activeEmbedId: text('active_embed_id', { length: UUID_LENGTH }),
		name: text('name', { length: MAXIMUM_NAME_LENGTH }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ guildId, name, activeEmbedId }) => ({
		idxGuildIdName: uniqueIndex('templates_idx_guild_id_name').on(guildId, name),
		idxGuildId: index('templates_idx_guild_id').on(guildId),
		idxName: index('templates_idx_name').on(name),
		idxActiveEmbedId: index('templates_idx_active_embed_id').on(activeEmbedId),
	}),
)

export const templateMentions = sqliteTable(
	'template_mention',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		templateId: text('template_id', { length: UUID_LENGTH }).references(() => templates.id, { onDelete: 'cascade' }),
		roleId: blob('role_id', { mode: 'bigint' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ templateId, roleId }) => ({
		idxTemplateIdRoleId: uniqueIndex('template_mentions_idx_template_id_role_id').on(templateId, roleId),
		idxRoleId: index('template_mentions_idx_role_id').on(roleId),
	}),
)

export const templatesRelations = relations(templates, ({ one, many }) => ({
	guild: one(guilds, { fields: [templates.guildId], references: [guilds.id] }),
	mentions: many(templateMentions),
}))

export const templateMentionsRelations = relations(templateMentions, ({ one }) => ({
	template: one(templates, { fields: [templateMentions.templateId], references: [templates.id] }),
}))
