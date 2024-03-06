import type {
	GuildExplicitContentFilter,
	GuildMFALevel,
	GuildNSFWLevel,
	GuildVerificationLevel,
	Locale,
} from '@discordjs/core'
import { EmbedLimits } from '@sapphire/discord-utilities'
import { relations } from 'drizzle-orm'
import {
	bigint,
	boolean,
	index,
	integer,
	pgTable,
	primaryKey,
	smallint,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

import {
	CUID_LENGTH,
	HEX_COLOR_LENGTH,
	IMAGES_URL_LENGTH_LIMIT,
	LOCALE_LENGTH,
	MAXIMUM_NAME_LENGTH,
	MAXIMUM_REASON_LENGTH,
} from '$/lib/constants'
import { BlacklistType, RequestStatus, SubscriptionPlan } from '$/lib/enums'
import { cuidDefaultFn } from '$/lib/utils'

export const guilds = pgTable(
	'guild',
	{
		id: bigint('id', { mode: 'bigint' }).primaryKey(),
		alliancesChannelId: bigint('alliances_channel_id', { mode: 'bigint' }),
		subscriptionPlan: smallint('subscription_plan').default(SubscriptionPlan.Free).$type<SubscriptionPlan>(),
		subscriptionStartDate: timestamp('subscription_start_date', { mode: 'date' }).defaultNow(),
		subscriptionEndDate: timestamp('subscription_end_date', { mode: 'date' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		subscriptionPlanIdx: index('subscription_plan_idx').on(table.subscriptionPlan),
	}),
)

export const seekers = pgTable('seeker', {
	id: bigint('id', { mode: 'bigint' }).primaryKey(),
	verified: boolean('verified').default(false),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
})

export const guildSeekers = pgTable(
	'guild_seekers',
	{
		seekerId: bigint('seeker_id', { mode: 'bigint' }).references(() => seekers.id),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		foreignKey: primaryKey({ columns: [table.seekerId, table.guildId] }),
	}),
)

export const alliances = pgTable(
	'alliance',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		seekerId: bigint('seeker_id', { mode: 'bigint' }).references(() => seekers.id),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		status: smallint('status').notNull().$type<RequestStatus>(),
		hereMention: boolean('here_mention').default(false),
		everyoneMention: boolean('everyone_mention').default(false),
		acceptedAt: timestamp('accepted_at', { mode: 'date' }),
		denialReason: varchar('denial_reason', { length: MAXIMUM_REASON_LENGTH }),
		deniedAt: timestamp('denied_at', { mode: 'date' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		seekerIdx: uniqueIndex('alliances_seeker_idx').on(table.seekerId),
		guildIdx: index('alliances_guild_idx').on(table.guildId),
		statusIdx: index('alliances_status_idx').on(table.status),
	}),
)

export const partnerships = pgTable(
	'partnership',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		seekerId: bigint('seeker_id', { mode: 'bigint' }).references(() => seekers.id),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		status: smallint('status').notNull().$type<RequestStatus>(),
		hereMention: boolean('here_mention').default(false),
		everyoneMention: boolean('everyone_mention').default(false),
		endDate: timestamp('end_date', { mode: 'date' }),
		acceptedAt: timestamp('accepted_at', { mode: 'date' }),
		denialReason: varchar('denial_reason', { length: MAXIMUM_REASON_LENGTH }),
		deniedAt: timestamp('denied_at', { mode: 'date' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		seekerIdx: uniqueIndex('partnerships_seeker_idx').on(table.seekerId),
		guildIdx: index('partnerships_guild_idx').on(table.guildId),
		statusIdx: index('partnerships_status_idx').on(table.status),
	}),
)

export const requirements = pgTable(
	'requirement',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		verified: boolean('verified'),
		partnered: boolean('partnered'),
		minAge: smallint('minimum_age'),
		minBoosts: smallint('minimum_boosts'),
		minMembers: integer('minimum_members'),
		creationDate: timestamp('creation_date', { mode: 'date' }),
		mfaLevel: smallint('mfa_level').$type<GuildMFALevel>(),
		nsfwContentLevel: smallint('nsfw_content_level').$type<GuildNSFWLevel>(),
		verificationLevel: smallint('verification_level').$type<GuildVerificationLevel>(),
		locales: varchar('locales', { length: LOCALE_LENGTH }).array().$type<Locale[]>(),
		excludedLocales: varchar('excluded_locales', { length: LOCALE_LENGTH }).array().$type<Locale[]>(),
		explicitContentLevel: smallint('explicit_content_level').$type<GuildExplicitContentFilter>(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		guildIdx: index('requirements_guild_idx').on(table.guildId),
	}),
)

export const templates = pgTable(
	'template',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		name: varchar('name', { length: MAXIMUM_NAME_LENGTH }).unique().notNull(),
		roleMentionsIds: bigint('role_mentions_ids', { mode: 'bigint' }).array(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		guildIdNameIdx: uniqueIndex('guild_id_name_idx').on(table.guildId, table.name),
	}),
)

export const embeds = pgTable(
	'embed',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		templateId: uuid('template_id').references(() => templates.id),
		isActive: boolean('is_active').default(false),
		name: varchar('name', { length: MAXIMUM_NAME_LENGTH }).unique().notNull(),
		authorName: varchar('author_name', { length: EmbedLimits.MaximumAuthorNameLength }),
		authorIconURL: varchar('author_icon_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		title: varchar('title', { length: EmbedLimits.MaximumTitleLength }),
		description: varchar('description', { length: EmbedLimits.MaximumDescriptionLength }),
		hexColor: varchar('hex_color', { length: HEX_COLOR_LENGTH }),
		imageURL: varchar('image_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		thumbnailURL: varchar('thumbnail_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		footerText: varchar('footer_text', { length: EmbedLimits.MaximumFooterLength }),
		footerIconURL: varchar('footer_icon_url', { length: IMAGES_URL_LENGTH_LIMIT }),
		footerTimestamp: boolean('footer_timestamp'),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		templateIdNameIdx: uniqueIndex('template_id_name_idx').on(table.templateId, table.name),
		isActiveIdx: index('is_active_idx').on(table.isActive),
	}),
)

export const embedFields = pgTable(
	'embed_field',
	{
		id: varchar('id', { length: CUID_LENGTH }).primaryKey().$defaultFn(cuidDefaultFn),
		embedId: uuid('embed_id').references(() => embeds.id),
		name: varchar('name', { length: EmbedLimits.MaximumFieldNameLength }).notNull(),
		value: varchar('value', { length: EmbedLimits.MaximumFieldValueLength }).notNull(),
		inline: boolean('inline').default(false),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		embedIdx: uniqueIndex('embed_idx').on(table.embedId),
	}),
)

export const blacklists = pgTable(
	'blacklist',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		guildId: bigint('guild_id', { mode: 'bigint' }).unique().notNull(),
		userId: bigint('user_id', { mode: 'bigint' }).notNull(),
		type: smallint('type').notNull().$type<BlacklistType>(),
		reason: varchar('reason', { length: MAXIMUM_REASON_LENGTH }),
		expirationDate: timestamp('expiration_date', { mode: 'date' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		guildIdx: index('blacklist_guild_idx').on(table.guildId),
		userIdx: index('blacklist_user_idx').on(table.userId),
	}),
)

export const guildBlacklists = pgTable(
	'guild_blacklist',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		guildId: bigint('guild_id', { mode: 'bigint' }).references(() => guilds.id),
		userId: bigint('user_id', { mode: 'bigint' }).notNull(),
		blacklistedGuildId: bigint('blacklisted_guild_id', { mode: 'bigint' }).unique().notNull(),
		type: smallint('type').notNull().$type<BlacklistType>(),
		reason: varchar('reason', { length: MAXIMUM_REASON_LENGTH }),
		expirationDate: timestamp('expiration_date', { mode: 'date' }),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
	},
	(table) => ({
		guildIdx: index('guild_blacklist_guild_idx').on(table.guildId),
		userIdx: index('guild_blacklist_user_idx').on(table.userId),
		blacklistedGuildIdx: index('blacklisted_guild_idx').on(table.blacklistedGuildId),
	}),
)

export const guildsRelations = relations(guilds, ({ one, many }) => ({
	template: one(templates, { fields: [guilds.id], references: [templates.guildId] }),
	requirements: one(requirements, { fields: [guilds.id], references: [requirements.guildId] }),
	blacklists: many(guildBlacklists),
	seekers: many(guildSeekers),
	alliances: many(alliances),
	partnerships: many(partnerships),
}))

export const templatesRelations = relations(templates, ({ many }) => ({
	embed: many(embeds),
}))

export const embedsRelations = relations(embeds, ({ one, many }) => ({
	template: one(templates, { fields: [embeds.templateId], references: [templates.id] }),
	fields: many(embedFields),
}))

export const embedFieldsRelations = relations(embedFields, ({ one }) => ({
	embed: one(embeds, { fields: [embedFields.embedId], references: [embeds.id] }),
}))

export const guildBlacklistsRelations = relations(guildBlacklists, ({ one }) => ({
	guild: one(guilds, { fields: [guildBlacklists.guildId], references: [guilds.id] }),
}))

export const alliancesRelations = relations(alliances, ({ one }) => ({
	seeker: one(seekers, { fields: [alliances.seekerId], references: [seekers.id] }),
	guild: one(guilds, { fields: [alliances.guildId], references: [guilds.id] }),
}))

export const partnershipsRelations = relations(partnerships, ({ one }) => ({
	seeker: one(seekers, { fields: [partnerships.seekerId], references: [seekers.id] }),
	guild: one(guilds, { fields: [partnerships.guildId], references: [guilds.id] }),
}))

export const requirementsRelations = relations(requirements, ({ one }) => ({
	guild: one(guilds, { fields: [requirements.guildId], references: [guilds.id] }),
}))

export const seekersRelations = relations(seekers, ({ many }) => ({
	alliances: many(alliances),
	partnerships: many(partnerships),
	guildSeekers: many(guildSeekers),
}))

export const guildSeekersRelations = relations(guildSeekers, ({ one }) => ({
	seeker: one(seekers, { fields: [guildSeekers.seekerId], references: [seekers.id] }),
	guild: one(guilds, { fields: [guildSeekers.guildId], references: [guilds.id] }),
}))
