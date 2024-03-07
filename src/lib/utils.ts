import { createClient } from '@libsql/client'
import { init } from '@paralleldrive/cuid2'
import { Table, getTableColumns } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import type { Context } from 'hono'
import { v4 as uuid } from 'uuid'

import * as schemas from '$/db/schemas'
import { CUID_LENGTH } from '$/lib/constants'
import type { Bindings } from '$/lib/types'

export const createCUID = init({ length: CUID_LENGTH, fingerprint: 'hono-bun' })
export const cuidDefaultFn = () => createCUID()
export const cuidFn = () => createCUID()
export const uuidFn = () => uuid()
export const dateFn = () => new Date()
export const toBigInt = (value?: string) => (value ? BigInt(value) : undefined)

export function queryParseNumber(value?: string): number | undefined {
	return value ? Number.parseInt(value) : undefined
}

export function getAllowedQueries<T extends readonly string[]>(allowed: T, queries?: string[]) {
	if (!queries || queries.length <= 0) return undefined

	const filtered = queries.filter((w) => allowed.includes(w))
	const entries = filtered.map<[T[number], boolean]>((w) => [w, true])

	return Object.fromEntries(entries) as { [K in T[number]]?: true }
}

export function getTableKeys<T extends Table>(table: T) {
	const guildTableColumns = getTableColumns(table)
	return Object.keys(guildTableColumns) as (keyof typeof guildTableColumns)[]
}

export function drizzleClient(c: Context<Bindings>) {
	const sql = createClient({ url: c.env.DATABASE_URL, authToken: c.env.DATABASE_AUTH_TOKEN })
	return drizzle<typeof schemas>(sql)
}
