import { z } from 'zod'

import { toBigInt } from '$/lib/utils'

export const guildPostSchema = z.object({
	id: z.string({ required_error: 'id is required' }).describe('The id of the guild').transform(toBigInt),
	alliancesChannelId: z.string().optional().describe('The id of the alliances channel').transform(toBigInt),
	createdAt: z.date().optional().describe('The date the guild was created'),
	updatedAt: z.date().optional().describe('The date the guild was last updated'),
})
