import {getServerSession} from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import prisma from '@/lib/prisma'
import { User } from 'next-auth'
import { NextRequest } from 'next/server'


export async function DELETE(request: NextRequest , {params} : {params: {messageid: string}}){
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    const messageid = params.messageid

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{status: 500})
    }

    const userId = user.id?.toString()

    try{
        const deletedMessage = await prisma.message.delete({
            where:{
                id: parseInt(messageid)
            }
        })

        if(!deletedMessage){
            return Response.json({
                success: false,
                message: "Message not found"
            })
        }

            return Response.json({
                success: true,
                message: "Message deleted"
            },{status: 200})
    }
    catch(error){
            return Response.json({
                success: false,
                message: "Internal server error"
            },{status: 500})
    }
}