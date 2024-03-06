import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '$/db/client'
import { guilds } from '$/db/schema'
import { ALLOWED_GUILDS_WITHES } from '$/lib/constants'
import { getAllowedQueries, getTableKeys, queryParseNumber } from '$/lib/utils'

const app = new Hono()

app.get('/', async (ctx) => {
	const { limit, offset } = ctx.req.query()

	const withes = ctx.req.queries('with')
	const columns = ctx.req.queries('columns')

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

	return ctx.json({ data })
})

app.get('/:id', async (ctx) => {
	const id = ctx.req.param('id')
	const bigintId = BigInt(id)
	const withes = ctx.req.queries('with')
	const columns = ctx.req.queries('columns')

	const findWith = getAllowedQueries(ALLOWED_GUILDS_WITHES, withes)
	const findColumns = getAllowedQueries(getTableKeys(guilds), columns)

	const data = await db.query.guilds.findFirst({
		where: eq(guilds.id, bigintId),
		with: findWith,
		columns: findColumns,
	})

	return ctx.json({ data })
})

app.post('/', async (ctx) => {})

export default app
