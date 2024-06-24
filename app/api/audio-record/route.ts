import { createClient, FileSource } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { clerkClient } from "@clerk/nextjs/server";
import { basePrompt } from "@/lib/constants";
import { getChatGPTResponse } from "@/lib/GPTHelpers/GPTHelpers";

const deepgram = createClient("02032149dde07a56222f70bba9c91d1e8021c593");

export async function POST(req: NextRequest) {
  try {
    // Extract form data from the request
    const formData = await req.formData();
    const file = formData.get("file");
    const sessionId = formData.get("sessionId");
    if (!file || !(file instanceof Blob)) {
      throw new Error("Invalid file uploaded");
    }

    // Convert Blob to ArrayBuffer
    const buffer = await file.arrayBuffer();
    console.log(buffer);
    // Transcribe the audio file using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer as FileSource,
      {
        model: "nova-2",
      }
    );

    if (error) {
      console.error("Error transcribing audio:", error);
      return NextResponse.error();
    }

    // Extract the transcript
    const text = result?.results.channels[0].alternatives[0].transcript;
    // const response: any = await getChatGPTResponse({
    //   sessionId: sessionId as string,
    //   prompt: text,
    //   newPrompt: false,
    // });
    // if (!response) {
    //   return NextResponse.error();
    // }
    return NextResponse.json({
      // text: response.text,
      transcript: text,
      // conversation: response.conversation,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.error();
  }
}
