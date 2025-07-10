import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2, "minimum 2 characters")
.max(20, "maximum 20 characters in the username")
.regex(/^[a-zA-Z0-9_]+/ , "Username must not contain special character")

export const passwordSchema = z
.string()
.min(8, "Password must be at least 8 characters")
.regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must include at least one special character")
.regex(/[A-Z]/, "Password must include at least one uppercase letter")
.regex(/[a-z]/, "Password must include at least one lowercase letter");

export const signUpSchema = z.object({
    username : usernameValidation ,
    email : z.string().email({message : "Invalid email"}),
    password : passwordSchema    
})