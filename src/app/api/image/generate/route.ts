import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { checkCredits, decrementCredits } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: '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',});

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

    const hasCredits = await checkCredits();
    if (!hasCredits) {
      return new NextResponse("Not enough credits", { status: 403 });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    await decrementCredits();

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
