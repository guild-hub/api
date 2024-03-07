import { relations } from 'drizzle-orm'
import { blob, index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { alliances } from '$/db/schemas/alliances'
import { embeds } from '$/db/schemas/embeds'
import { partnerships } from '$/db/schemas/partnerships'
import { requirements } from '$/db/schemas/requirements'
import { seekers } from '$/db/schemas/seekers'
import { templates } from '$/db/schemas/templates'

import { MAXIMUM_REASON_LENGTH, UUID_LENGTH } from '$/lib/constants'
import { BlacklistType, SubscriptionPlan } from '$/lib/enums'
import { dateFn, uuidFn } from '$/lib/utils'

export const guilds = sqliteTable(
	'guild',
	{
		id: blob('id', { mode: 'bigint' }).primaryKey(),
		alliancesChannelId: blob('alliances_channel_id', { mode: 'bigint' }),
		partnershipsChannelId: blob('partnerships_channel_id', { mode: 'bigint' }),
		subscriptionPlan: integer('subscription_plan').$type<SubscriptionPlan>(),
		subscriptionStartDate: integer('subscription_start_date', { mode: 'timestamp' }),
		subscriptionEndDate: integer('subscription_end_date', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ subscriptionPlan, alliancesChannelId, partnershipsChannelId }) => ({
		idxSubscriptionPlan: index('guilds_idx_subscription_plan').on(subscriptionPlan),
		idxAlliancesChannelId: index('guilds_idx_alliances_channel_id').on(alliancesChannelId),
		idxPartnershipsChannelId: index('guilds_idx_partnerships_channel_id').on(partnershipsChannelId),
	}),
)

export const guildSeekers = sqliteTable(
	'guild_seekers',
	{
		guildId: blob('guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		seekerId: blob('user_id', { mode: 'bigint' }).references(() => seekers.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ seekerId, guildId }) => ({
		idxGuildIdSeekerId: uniqueIndex('guild_seekers_idx_guild_id_seeker_id').on(seekerId, guildId),
	}),
)

export const guildBlacklists = sqliteTable(
	'guild_blacklist',
	{
		id: text('id', { length: UUID_LENGTH }).primaryKey().$defaultFn(uuidFn),
		guildId: blob('guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		userId: blob('user_id', { mode: 'bigint' }).notNull(),
		blacklistedGuildId: blob('blacklisted_guild_id', { mode: 'bigint' }).notNull(),
		type: integer('type', { mode: 'number' }).notNull().$type<BlacklistType>(),
		reason: text('reason', { length: MAXIMUM_REASON_LENGTH }),
		expirationDate: integer('expiration_date', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ guildId, userId, blacklistedGuildId }) => ({
		idxGuildIdBlacklistedGuildId: uniqueIndex('guild_blacklists_idx_guild_id_blacklisted_guild_id').on(
			guildId,
			blacklistedGuildId,
		),
		idxGuildId: index('guild_blacklists_idx_guild_id').on(guildId),
		idxUserId: index('guild_blacklists_idx_user_id').on(userId),
		idxBlacklistedGuildId: index('guild_blacklists_idx_blacklisted_guild_id').on(blacklistedGuildId),
	}),
)

export const guildsRelations = relations(guilds, ({ one, many }) => ({
	template: one(templates, { fields: [guilds.id], references: [templates.guildId] }),
	requirements: one(requirements, { fields: [guilds.id], references: [requirements.guildId] }),
	blacklists: many(guildBlacklists),
	seekers: many(guildSeekers),
	alliances: many(alliances, { relationName: 'senderGuild' }),
	partnerships: many(partnerships, { relationName: 'senderGuild' }),
	embeds: many(embeds),
}))

export const guildSeekersRelations = relations(guildSeekers, ({ one }) => ({
	seeker: one(seekers, { fields: [guildSeekers.seekerId], references: [seekers.id] }),
	guild: one(guilds, { fields: [guildSeekers.guildId], references: [guilds.id] }),
}))

export const guildBlacklistsRelations = relations(guildBlacklists, ({ one }) => ({
	guild: one(guilds, { fields: [guildBlacklists.guildId], references: [guilds.id] }),
}))
