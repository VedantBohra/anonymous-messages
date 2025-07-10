import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user || !user.id) {
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const acceptMessages = body.acceptMessages;

    if (typeof acceptMessages !== "boolean") {
      return NextResponse.json(
        { success: false, message: "acceptMessages must be a boolean" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: String(user.id) }, // Ensure it's a string primitive
      data: { isAcceptingMessages: acceptMessages },
    });

    return NextResponse.json(
      { success: true, message: "User ready to accept messages" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to update user status:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user || !user.id) {
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 401 }
    );
  }

  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: String(user.id) }, // safer and more efficient
    });

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
