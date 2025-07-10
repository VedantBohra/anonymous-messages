import {getServerSession} from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request){
    const {username , content} = await request.json()

    try{
        const user = await prisma.user.findFirst({
            where: {username}
        })

        if(!user){
            return Response.json({
            success: false,
            message: "user not found"
        }, {status: 404})
        }

        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting message"
            }, {status: 403})
        }

        const newMessage = {content , createdAt: new Date() , userId: user.id}
        const message = await prisma.message.create({ data: newMessage })

        return Response.json({
            success: true,
            message: "Message sent successfully",
            sentMessage: message
        })
    }

    catch(err){
        console.log(err)
         return Response.json({
            success: false,
            message: "Server error"
        }, {status: 500})
    }
}
