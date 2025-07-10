import {boolean, z} from 'zod'

export const acceptingMessagesSchema = z.object({
    acceptMessages : z.boolean()
})