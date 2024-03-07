import { EmbedLimits } from '@sapphire/discord-utilities'
import { relations } from 'drizzle-orm'
import { blob, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { guilds } from '$/db/schemas/guilds'

import { CUID_LENGTH, HEX_COLOR_LENGTH, IMAGES_URL_LENGTH_LIMIT, MAXIMUM_NAME_LENGTH, UUID_LENGTH } from '$/lib/constants'
import { cuidFn, dateFn, uuidFn } from '$/lib/utils'

export const embeds = sqliteTable(
	'embed',
	{
		id: text('id', { length: UUID_LENGTH }).primaryKey().$defaultFn(uuidFn),
		guildId: blob('guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		active: integer('active', { mode: 'boolean' }).default(false),
		name: text('name', { length: MAXIMUM_NAME_LENGTH }).notNull(),
		authorName: text('author_name', { length: EmbedLimits.MaximumAuthorNameLength }),
		authorIconURL: text('author_icon_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		title: text('title', { length: EmbedLimits.MaximumTitleLength }),
		description: text('description', { length: EmbedLimits.MaximumDescriptionLength }),
		hexColor: text('hex_color', { length: HEX_COLOR_LENGTH }),
		imageURL: text('image_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		thumbnailURL: text('thumbnail_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		footerText: text('footer_text', { length: EmbedLimits.MaximumFooterLength }),
		footerIconURL: text('footer_icon_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		footerTimestamp: integer('footer_timestamp', { mode: 'boolean' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ guildId, name, active }) => ({
		idxGuildIdName: uniqueIndex('embeds_idx_guild_id_name').on(guildId, name),
		idxGuildId: index('embeds_idx_guild_id').on(guildId),
		idxName: index('embeds_idx_name').on(name),
		idxActive: index('embeds_idx_active').on(active),
	}),
)

export const embedFields = sqliteTable(
	'embed_field',
	{
		id: text('id', { length: CUID_LENGTH }).primaryKey().$defaultFn(cuidFn),
		embedId: text('embed_id', { length: UUID_LENGTH }).references(() => embeds.id, { onDelete: 'cascade' }),
		name: text('name', { length: EmbedLimits.MaximumFieldNameLength }).notNull(),
		value: text('value', { length: EmbedLimits.MaximumFieldValueLength }).notNull(),
		inline: integer('inline', { mode: 'boolean' }).default(false),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ embedId, name, value, inline }) => ({
		idxEmbedId: index('embeds_fields_idx_embed_id').on(embedId),
		idxName: index('embeds_fields_idx_name').on(name),
		idxValue: index('embeds_fields_idx_value').on(value),
		idxInline: index('embeds_fields_idx_inline').on(inline),
	}),
)

export const embedsRelations = relations(embeds, ({ one, many }) => ({
	guild: one(guilds, { fields: [embeds.guildId], references: [guilds.id] }),
	fields: many(embedFields),
}))

export const embedFieldsRelations = relations(embedFields, ({ one }) => ({
	embed: one(embeds, { fields: [embedFields.embedId], references: [embeds.id] }),
}))
