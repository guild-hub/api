import '$/lib/env'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const sql = neon<boolean, boolean>(process.env.DATABASE_URL)

const db = drizzle(sql)

try {
	await migrate(db, { migrationsFolder: 'src/db/migrations' })
	console.log('Migrations ran successfully')
} catch (error) {
	console.error('Error running migrations:', error)
	process.exit(1)
}
