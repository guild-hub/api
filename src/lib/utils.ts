import { init } from '@paralleldrive/cuid2'
import { Table, getTableColumns } from 'drizzle-orm'

import { CUID_LENGTH } from '$/lib/constants'

export const createCUID = init({ length: CUID_LENGTH, fingerprint: 'hono-bun' })
export const cuidDefaultFn = () => createCUID()
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
