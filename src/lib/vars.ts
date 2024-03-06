import { neon } from '@neondatabase/serverless'
import { type NeonHttpDatabase, drizzle } from 'drizzle-orm/neon-http'
import type { Context, MiddlewareHandler } from 'hono'

import * as schema from '$/db/schema'
import type { Bindings } from '$/lib/types'

type DB_MIDDLEWARE_VARIABLES = {
	db: (c: Context<Bindings & { Variables: DB_MIDDLEWARE_VARIABLES }>) => NeonHttpDatabase<typeof schema>
}

export const dbMiddleware: MiddlewareHandler<{
	Variables: DB_MIDDLEWARE_VARIABLES
}> = async (c, next) => {
	c.set('db', (c) => {
		const sql = neon<boolean, boolean>(c.env.DATABASE_URL)
		return drizzle(sql, { schema })
	})
	await next()
}
