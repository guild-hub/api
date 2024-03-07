import '$/lib/env'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

const sql = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN })
const db = drizzle(sql)

try {
	await migrate(db, { migrationsFolder: 'src/db/migrations' })
	console.log('Migrations ran successfully')
} catch (error) {
	console.error('Error running migrations:', error)
	process.exit(1)
}
