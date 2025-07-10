import {z} from 'zod'

export const verifySchema = z.object({
    code : z.string().length(6 , "Code length should be of 6 digits")  
})