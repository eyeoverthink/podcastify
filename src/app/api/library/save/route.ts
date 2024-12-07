import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { type, layers, thumbnail } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!type || !layers || !thumbnail) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Save the project to the database
    const project = await prismadb.project.create({
      data: {
        userId,
        type,
        content: JSON.stringify(layers),
        thumbnail,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.log("[LIBRARY_SAVE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
