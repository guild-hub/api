import '$/lib/env'
import { drizzle } from 'drizzle-orm/libsql'

import * as schemas from '$/db/schemas'
import { createClient } from '@libsql/client'

const sql = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN })
const db = drizzle(sql, { schema: schemas })

try {
	console.log('Seeding database')

	const promises = [
		db.delete(schemas.guilds),
		db.delete(schemas.seekers),
		db.delete(schemas.requirements),
		db.delete(schemas.blacklists),
		db.delete(schemas.embeds),
		db.delete(schemas.templates),
		db.delete(schemas.alliances),
		db.delete(schemas.partnerships),
	]

	await Promise.all(promises)

	console.log('Database seeded successfully')
} catch (error) {
	console.error('Error seeding database:', error)
	process.exit(1)
}
