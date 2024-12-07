import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let query = {
      userId,
    };

    // Add type filter if specified and not 'all'
    if (type && type !== 'all') {
      query = {
        ...query,
        type: type.slice(0, -1), // Remove 's' from the end (images -> image)
      };
    }

    const content = await db.content.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.log("[LIBRARY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
