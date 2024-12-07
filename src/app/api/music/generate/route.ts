import { NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API!,
});

const MUSIC_GENERATION_COST = 1;

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
    const user = await prisma.user.findUnique({
      where: { userId: userId },
      select: { credits: true }
    });

    if (!user || user.credits < MUSIC_GENERATION_COST) {
      return new NextResponse("Not enough credits", { status: 402 });
    }

    // Generate music
    const response = await replicate.run(
      `meta/musicgen:${process.env.REPLICATE_MUSICGEN_VERSION}`,
      {
        input: {
          model_version: process.env.REPLICATE_MUSICGEN_MODEL,
          prompt,
          duration: 8
        }
      }
    );

    // Deduct credits
    await prisma.user.update({
      where: { userId: userId },
      data: { credits: { decrement: MUSIC_GENERATION_COST } }
    });

    // Save the generated music to history
    await prisma.music.create({
      data: {
        userId: userId,
        prompt: prompt,
        audioUrl: response as string
      }
    });

    return NextResponse.json({ audioUrl: response });
  } catch (error) {
    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
