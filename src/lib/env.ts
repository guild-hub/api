import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string(),
	DATABASE_AUTH_TOKEN: z.string(),
})

envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
