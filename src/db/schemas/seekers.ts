import { relations } from 'drizzle-orm'
import { blob, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

import { alliances } from '$/db/schemas/alliances'
import { guildSeekers } from '$/db/schemas/guilds'
import { partnerships } from '$/db/schemas/partnerships'

import { dateFn } from '$/lib/utils'

export const seekers = sqliteTable('seekers', {
	id: blob('id', { mode: 'bigint' }).primaryKey(),
	verified: integer('verified', { mode: 'boolean' }).default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(dateFn),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(dateFn),
})

export const seekersRelations = relations(seekers, ({ many }) => ({
	alliances: many(alliances, { relationName: 'senderSeeker' }),
	partnerships: many(partnerships, { relationName: 'senderSeeker' }),
	guildSeekers: many(guildSeekers),
}))
