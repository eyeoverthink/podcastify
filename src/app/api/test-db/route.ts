import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";

export async function GET() {
  try {
    // Get the first user and their credits
    const user = await prismadb.user.findFirst();
    return NextResponse.json({ 
      status: "Connected to MongoDB", 
      user: {
        id: user?.id,
        email: user?.email,
        credits: user?.credits
      }
    });
  } catch (error) {
    console.error("[DATABASE_TEST_ERROR]", error);
    return NextResponse.json({ status: "Error", error: error.message }, { status: 500 });
  }
}
