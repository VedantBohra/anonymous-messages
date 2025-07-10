import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { User } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "User not authenticated",
      }, { status: 401 });
    }

    const user = session.user as User;
    const userId = user.id?.toString();

    if (!userId) {
      return Response.json({
        success: false,
        message: "User ID not found in session",
      }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({
      success: true,
      messages, // use consistent key
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching messages:", err);
    return Response.json({
      success: false,
      message: "Server error",
    }, { status: 500 });
  }
}
