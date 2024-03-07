import type { GuildExplicitContentFilter, GuildMFALevel, GuildNSFWLevel, GuildVerificationLevel, Locale } from '@discordjs/core'
import { relations } from 'drizzle-orm'
import { blob, index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { guilds } from '$/db/schemas/guilds'

import { LOCALE_LENGTH, UUID_LENGTH } from '$/lib/constants'
import { dateFn, uuidFn } from '$/lib/utils'

export const requirements = sqliteTable('requirements', {
	id: text('id', { length: UUID_LENGTH }).primaryKey().$defaultFn(uuidFn),
	guildId: blob('guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
	verified: integer('verified', { mode: 'boolean' }),
	partnered: integer('partnered', { mode: 'boolean' }),
	minimumAge: integer('minimum_age', { mode: 'number' }),
	minimumBoosts: integer('minimum_boosts', { mode: 'number' }),
	minimumMembers: integer('minimum_members', { mode: 'number' }),
	creationDate: integer('creation_date', { mode: 'timestamp' }),
	mfaLevel: integer('mfa_level', { mode: 'number' }).$type<GuildMFALevel>(),
	nsfwContentLevel: integer('nsfw_content_level', { mode: 'number' }).$type<GuildNSFWLevel>(),
	verificationLevel: integer('verification_level', { mode: 'number' }).$type<GuildVerificationLevel>(),
	explicitContentLevel: integer('explicit_content_level', { mode: 'number' }).$type<GuildExplicitContentFilter>(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
})

export const requirementsLocales = sqliteTable(
	'requirements_locale',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		requirementsId: text('requirements_id', { length: UUID_LENGTH }).references(() => requirements.id),
		locale: text('locale', { length: LOCALE_LENGTH }).$type<Locale>(),
		excluded: integer('excluded', { mode: 'boolean' }),
	},
	({ requirementsId, locale, excluded }) => ({
		idxRequirementsIdLocale: uniqueIndex('requirements_locales_idx_requirements_id_locale').on(requirementsId, locale),
		idxLocale: index('requirements_locales_idx_locale').on(locale),
		idxExcluded: index('requirements_locales_idx_excluded').on(excluded),
	}),
)

export const requirementsRelations = relations(requirements, ({ one, many }) => ({
	guild: one(guilds),
	locales: many(requirementsLocales),
}))

export const requirementsLocalesRelations = relations(requirementsLocales, ({ one }) => ({
	requirements: one(requirements, { fields: [requirementsLocales.requirementsId], references: [requirements.id] }),
}))
