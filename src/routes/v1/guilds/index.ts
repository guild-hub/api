import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { guilds } from '$/db/schemas'
import { ALLOWED_GUILDS_WITHES } from '$/lib/constants'
import type { Bindings } from '$/lib/types'
import { drizzleClient, getAllowedQueries, getTableKeys, queryParseNumber } from '$/lib/utils'

const app = new Hono<Bindings>()

app.get('/', async (c) => {
	const db = drizzleClient(c)

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

	return c.json({ data }, 200)
})

app.get('/:id', async (c) => {
	const db = drizzleClient(c)

	const id = c.req.param('id')
	const withes = c.req.queries('with')
	const columns = c.req.queries('columns')

	const bigintId = BigInt(id)

	const findWith = getAllowedQueries(ALLOWED_GUILDS_WITHES, withes)
	const findColumns = getAllowedQueries(getTableKeys(guilds), columns)

	const data = await db.query.guilds.findFirst({
		where: eq(guilds.id, bigintId),
		with: findWith,
		columns: findColumns,
	})

	return c.json({ data }, 200)
})

app.post('/', async (c) => {})

export default app
