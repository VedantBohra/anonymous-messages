import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import prisma from '@/lib/prisma'
import { User } from 'next-auth'

export async function DELETE({params} : {params : {messageid : string}}) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User
  const messageid = params.messageid 

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'Error verifying user',
      },
      { status: 401 }
    )
  }

  try {
    const deletedMessage = await prisma.message.delete({
      where: {
        id: parseInt(messageid),
      },
    })

    if (!deletedMessage) {
      return Response.json(
        {
          success: false,
          message: 'Message not found',
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Message deleted',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}