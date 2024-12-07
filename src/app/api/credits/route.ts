import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { prismadb } from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Get Clerk user details
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return new NextResponse("User not found", { status: 404 });
      }

      // Create user with initial credits if they don't exist
      try {
        const newUser = await prismadb.user.create({
          data: {
            id: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : undefined,
            imageUrl: clerkUser.imageUrl,
            credits: 1000,
          },
        });
        return NextResponse.json({ credits: newUser.credits });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          // If user already exists, fetch and return their credits
          const existingUser = await prismadb.user.findUnique({
            where: { email: clerkUser.emailAddresses[0].emailAddress },
          });
          if (existingUser) {
            return NextResponse.json({ credits: existingUser.credits });
          }
        }
        throw error;
      }
    }

    return NextResponse.json({ credits: user.credits });
  } catch (error) {
    console.log("[CREDITS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { amount, description } = await req.json();

    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create transaction record
    await prismadb.creditTransaction.create({
      data: {
        userId,
        amount,
        description,
      },
    });

    // Update user credits
    const updatedUser = await prismadb.user.update({
      where: { id: userId },
      data: {
        credits: user.credits + amount,
      },
    });

    return NextResponse.json({ credits: updatedUser.credits });
  } catch (error) {
    console.log("[CREDITS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
