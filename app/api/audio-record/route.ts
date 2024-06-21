import { createClient, FileSource } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";

const deepgram = createClient("02032149dde07a56222f70bba9c91d1e8021c593");

export async function POST(req: NextRequest) {
  try {
    // Extract form data from the request
    const formData = await req.formData();
    const file = formData.get("file");

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

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.error();
  }
}
