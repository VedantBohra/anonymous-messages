import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {username , code} = await request.json()
        const user = await prisma.user.findFirst({
            where:{
                username
            }
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true },
            });

            return Response.json({
                success: true,
                message: "User is verified"
            },{status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: true,
                message: "Code is expired please sign up again"
            },{status: 400})
        }
        else{
            return Response.json({
                success: true,
                message: "Invalid code "
            },{status: 400})
        }
    }

    catch(err){
        console.error('Error verifying user' , err)
        return Response.json({
            success: false,
            message: "Error verifying user" 
        },
        {status: 500})
    }
}

