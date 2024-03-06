import '$/lib/env'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from '$/db/schema'

const sql = neon<boolean, boolean>(process.env.DATABASE_URL)

const db = drizzle(sql, { schema })

try {
	console.log('Seeding database')

	const promises = [db.delete(schema.guilds), db.delete(schema.seekers), db.delete(schema.requirements)]

	await Promise.all(promises)

	console.log('Database seeded successfully')
} catch (error) {
	console.error('Error seeding database:', error)
	process.exit(1)
}
