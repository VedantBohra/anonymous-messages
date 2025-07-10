import {z} from 'zod'

export const messagesSchema = z.object({
    content : z.string()
    .min(10 , "Must be atleast 10 characters")
    .max(300 , "Cannot be more than 300 characters")
})