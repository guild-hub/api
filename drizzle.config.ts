import '$/lib/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	driver: 'turso',
	schema: 'src/db/schemas/index.ts',
	out: 'src/db/migrations',
	dbCredentials: { url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN },
	verbose: true,
})
