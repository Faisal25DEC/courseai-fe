import { createClient, FileSource } from "@deepgram/sdk";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { clerkClient } from "@clerk/nextjs/server";
import { basePrompt } from "@/lib/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to use environment variables for sensitive data
});

const systemSetup = basePrompt;
let conversationMemory: any = {};
const GPT4o = "gpt-4o";
export async function getChatGPTResponse({
  sessionId,
  prompt,
  newPrompt,
}: {
  sessionId: string;
  prompt: string;
  newPrompt?: boolean;
}) {
  try {
    if (!sessionId) {
      return null;
    }

    // Reset conversation memory if newPrompt is true
    if (newPrompt) {
      conversationMemory[sessionId] = [
        {
          role: "system",
          content: basePrompt + ".\n" + "####\n" + prompt + "####",
        },
      ];
    } else {
      // Retrieve the previous conversation context if it exists
      conversationMemory[sessionId] = conversationMemory[sessionId] || [
        {
          role: "system",
          content: systemSetup,
        },
      ];
    }

    const previousMessages = conversationMemory[sessionId];

    const chatCompletion = await openai.chat.completions.create({
      model: GPT4o,
      messages: [...previousMessages, { role: "user", content: prompt }],
    });

    // Get the AI's response
    const aiResponse = chatCompletion.choices[0].message.content;

    // Update the conversation memory with the new messages
    conversationMemory[sessionId] = [
      ...previousMessages,
      { role: "user", content: prompt },
      { role: "assistant", content: aiResponse },
    ];

    console.log(conversationMemory);
    return { text: aiResponse, conversation: conversationMemory[sessionId] };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.error();
  }
}

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
    const response = await getChatGPTResponse({
      sessionId: sessionId as string,
      prompt: text,
      newPrompt: false,
    });
    if (!response) {
      return NextResponse.error();
    }
    return NextResponse.json({ text: response.text, transcript: text });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.error();
  }
}
