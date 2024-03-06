import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

import v1 from '$/routes/v1'

import { envParseNumber } from '$/lib/env'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', prettyJSON())

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.route('/v1', v1)

export default { port: envParseNumber('PORT'), fetch: app.fetch }
