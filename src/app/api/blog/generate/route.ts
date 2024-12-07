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

    const { topic, tone, length } = await req.json();

    // Validate user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.credits < 5) {
      return new NextResponse("Insufficient credits", { status: 402 });
    }

    // Generate blog content with OpenAI
    const wordCount = length === "short" ? 500 : length === "medium" ? 1000 : 2000;
    
    const prompt = `Write a ${tone} blog post about ${topic}. The post should be approximately ${wordCount} words long. 
                   Include a catchy title, well-structured paragraphs, and a conclusion. 
                   Use appropriate headings and maintain a consistent ${tone} tone throughout.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional blog writer who creates engaging, well-researched content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    // Deduct credits and create transaction
    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: -5,
        description: `Generated blog post: ${topic}`,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: user.credits - 5,
      },
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("[BLOG_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
