import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
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

    const { content } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert book editor who enhances text for audio narration while maintaining the original meaning and style.",
        },
        {
          role: "user",
          content: `Enhance the following text for audio narration, making it more engaging and easier to listen to: ${content}`,
        },
      ],
    });

    const enhancedContent = completion.choices[0].message.content;

    return NextResponse.json({ enhancedContent });
  } catch (error) {
    console.error("[ENHANCE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
