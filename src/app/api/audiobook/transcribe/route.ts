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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const audio = formData.get("audio") as File | null;

    if (!file && !audio) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const audioFile = file || audio;
    if (!audioFile) {
      return new NextResponse("Invalid file", { status: 400 });
    }

    // Convert the file to a format OpenAI can handle
    const fileBuffer = Buffer.from(await audioFile.arrayBuffer());
    const fileName = audioFile.name || "audio.wav";

    const transcription = await openai.audio.transcriptions.create({
      file: {
        buffer: fileBuffer,
        name: fileName,
        type: audioFile.type,
      } as any, // Using any here because OpenAI's types are not fully compatible with File API
      model: "whisper-1",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("[TRANSCRIBE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
