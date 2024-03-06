import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string(),
	DISCORD_TOKEN: z.string(),
	DISCORD_GUILD_ID: z.string(),
	API_ACCESS_TOKEN: z.string(),
	PORT: z.string().default('5000'),
})

const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>

export function envParseNumber<T extends keyof Env>(variable: T): number {
	return Number.parseInt(env[variable])
}

export function envParseBoolean<T extends keyof Env>(variable: T): boolean {
	return env[variable] === 'true'
}

export function envParseArray<T extends keyof Env>(variable: T): string[] {
	return env[variable].split(', ')
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
