import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import prisma from '@/lib/prisma'
import { User } from 'next-auth'
import { NextRequest } from 'next/server'

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'Error verifying user',
      },
      { status: 401 }
    )
  }

  const url = new URL(req.url)
  const messageid = url.searchParams.get('id')

  if (!messageid) {
    return Response.json(
      {
        success: false,
        message: 'Missing id parameter',
      },
      { status: 400 }
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
    console.error("Error deleting message:", error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
