import prisma from "@/lib/prisma";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signinSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: NextRequest){
    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters'
            }, {status: 500})
        }

        const {username} = result.data

        const existingVerfiedUser = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        })

        if(!existingVerfiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        },{status: 200})
        
    }
    catch(err){
        console.error('Error checking username' , err)
        return Response.json({
            success: false,
            message: "Error checking username" 
        },
        {status: 500})
    }
}