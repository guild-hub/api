import { blob, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { MAXIMUM_REASON_LENGTH, UUID_LENGTH } from '$/lib/constants'
import type { BlacklistType } from '$/lib/enums'
import { dateFn, uuidFn } from '$/lib/utils'

export const blacklists = sqliteTable(
	'blacklist',
	{
		id: text('id', { length: UUID_LENGTH }).primaryKey().$defaultFn(uuidFn),
		guildId: blob('guild_id', { mode: 'bigint' }).unique().notNull(),
		userId: blob('user_id', { mode: 'bigint' }).notNull(),
		type: integer('type', { mode: 'number' }).notNull().$type<BlacklistType>(),
		reason: text('reason', { length: MAXIMUM_REASON_LENGTH }),
		expirationDate: integer('expiration_date', { mode: 'timestamp' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
		updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	},
	({ guildId, userId }) => ({
		idxGuildId: index('blacklists_idx_guild_id').on(guildId),
		idxUserId: index('blacklists_idx_user_id').on(userId),
	}),
)
