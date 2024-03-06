import '$/lib/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	driver: 'pg',
	schema: 'src/db/schema.ts',
	out: 'src/db/migrations',
	dbCredentials: { connectionString: process.env.DATABASE_URL },
	verbose: true,
})
