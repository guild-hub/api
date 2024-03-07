import { relations } from 'drizzle-orm'
import { blob, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { guilds } from '$/db/schemas/guilds'
import { seekers } from '$/db/schemas/seekers'

import { CUID_LENGTH, MAXIMUM_REASON_LENGTH } from '$/lib/constants'
import type { RequestStatus } from '$/lib/enums'
import { cuidFn, dateFn } from '$/lib/utils'

export const partnerships = sqliteTable(
	'partnership',
	{
		id: text('id', { length: CUID_LENGTH }).primaryKey().$defaultFn(cuidFn),
		senderSeekerId: blob('sender_seeker_id', { mode: 'bigint' }).references(() => seekers.id, { onDelete: 'cascade' }),
		receiverSeekerId: blob('receiver_seeker_id', { mode: 'bigint' }).references(() => seekers.id, { onDelete: 'cascade' }),
		senderGuildId: blob('sender_guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		receiverGuildId: blob('receiver_guild_id', { mode: 'bigint' }).references(() => guilds.id, { onDelete: 'cascade' }),
		status: integer('status', { mode: 'number' }).$type<RequestStatus>(),
		expirationDate: integer('expiration_date', { mode: 'timestamp' }),
		acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
		rejectedAt: integer('rejected_at', { mode: 'timestamp' }),
		rejectedReason: text('rejected_reason', { length: MAXIMUM_REASON_LENGTH }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ status, senderSeekerId, receiverSeekerId, senderGuildId, receiverGuildId }) => ({
		idxSenderSeeker: index('partnerships_idx_sender_seeker').on(senderSeekerId),
		idxReceiverSeeker: index('partnerships_idx_receiver_seeker').on(receiverSeekerId),
		idxSenderGuild: index('partnerships_idx_sender_guild').on(senderGuildId),
		idxReceiverGuild: index('partnerships_idx_receiver_guild').on(receiverGuildId),
		idxStatus: index('partnerships_idx_status').on(status),
	}),
)

export const partnershipsRelations = relations(partnerships, ({ one }) => ({
	senderSeeker: one(seekers, { fields: [partnerships.senderSeekerId], references: [seekers.id], relationName: 'senderSeeker' }),
	receiverSeeker: one(seekers, {
		fields: [partnerships.receiverSeekerId],
		references: [seekers.id],
		relationName: 'receiverSeeker',
	}),
	senderGuild: one(guilds, { fields: [partnerships.senderGuildId], references: [guilds.id], relationName: 'senderGuild' }),
	receiverGuild: one(guilds, {
		fields: [partnerships.receiverGuildId],
		references: [guilds.id],
		relationName: 'receiverGuild',
	}),
}))
