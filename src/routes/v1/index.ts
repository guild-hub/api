import { Hono } from 'hono'

import guilds from '$/routes/v1/guilds'

const app = new Hono()

app.route('/guilds', guilds)

export default app
