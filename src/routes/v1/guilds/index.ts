import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { guilds } from '$/db/schema'
import { ALLOWED_GUILDS_WITHES } from '$/lib/constants'
import type { Bindings } from '$/lib/types'
import { getAllowedQueries, getTableKeys, queryParseNumber } from '$/lib/utils'
import { dbMiddleware } from '$/lib/vars'

const app = new Hono<Bindings>()

app.get('/', dbMiddleware, async (c) => {
	const db = c.var.db(c)
	const { limit, offset } = c.req.query()

	const withes = c.req.queries('with')
	const columns = c.req.queries('columns')

	const findLimit = queryParseNumber(limit)
	const findOffset = queryParseNumber(offset)
	const findWith = getAllowedQueries(ALLOWED_GUILDS_WITHES, withes)
	const findColumns = getAllowedQueries(getTableKeys(guilds), columns)

	const data = await db.query.guilds.findMany({
		limit: findLimit,
		offset: findOffset,
		with: findWith,
		columns: findColumns,
	})

	return c.json({ data })
})

app.get('/:id', dbMiddleware, async (c) => {
	const db = c.var.db(c)
	const id = c.req.param('id')
	const bigintId = BigInt(id)
	const withes = c.req.queries('with')
	const columns = c.req.queries('columns')

	const findWith = getAllowedQueries(ALLOWED_GUILDS_WITHES, withes)
	const findColumns = getAllowedQueries(getTableKeys(guilds), columns)

	const data = await db.query.guilds.findFirst({
		where: eq(guilds.id, bigintId),
		with: findWith,
		columns: findColumns,
	})

	return c.json({ data })
})

app.post('/', async (c) => {})

export default app
