import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/options";
import {getServerSession} from "next-auth";
import {User} from 'next-auth'
import { NextRequest } from "next/server";

export async function POST(request: NextRequest){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{status: 500})
    }

    const userId = user.id?.toString()
    const {acceptMessages} = await request.json()

    try{
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {isAcceptingMessages: acceptMessages}
        })

        if(!updatedUser){
            return Response.json({
                success: false,
                message: "failed to update user status",
                updatedUser                
            }, {status: 401})
        }   

        return Response.json({
            success: true,
            message: "User ready to accept messages"
        }, {status: 200})
    }

    catch(err){
        console.log("Failed to update user status to accept our messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        },{status: 500})

    }
}

export async function GET(request: NextRequest){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{status: 500})
    }

    const userId = user.id?.toString()

    try{
        const foundUser = await prisma.user.findFirst({
        where:{ id: userId }
    })

    if(!foundUser){
        return Response.json({
            success: false,
            message: "Error Couldn't found user"
        }, {status: 404})
    }

     return Response.json({
            success: true,
            message: "user found",
            isAcceptingMessages: foundUser.isAcceptingMessages 
        }, {status: 200})
    }

    catch(error){
        console.log("Failed to accept user status to accept messages")
        return Response.json({
            success: false,
            messages: "Error in getting message acceptance status"
        }, {status: 500})
    }
}