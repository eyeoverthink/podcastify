import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text, voice, chapterId } = await req.json();

    // Validate user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.credits < 10) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }

    // Generate audio with OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // TODO: Upload buffer to your storage solution (e.g., S3)
    // For now, we'll return a mock URL
    const audioUrl = "/sample-audio.mp3";

    // Deduct credits and create transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: -10,
        description: `Generated audio for chapter ${chapterId}`,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: user.credits - 10,
      },
    });

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("[SYNTHESIZE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
