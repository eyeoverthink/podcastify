import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prismadb } from "@/lib/prismadb";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    // Check if user has enough credits
    const user = await prismadb.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.credits < 5) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }

    // Generate image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    // Deduct credits
    await prismadb.user.update({
      where: { id: userId },
      data: { credits: user.credits - 5 }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
