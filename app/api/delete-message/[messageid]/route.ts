import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import prisma from '@/lib/prisma'
import { User } from 'next-auth'
import type { NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const session = await getServerSession(authOptions)
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
        id: parseInt(messageid), // messageid will still be a string here
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
    console.error("Error deleting message:", error); // Log the actual error for debugging
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
