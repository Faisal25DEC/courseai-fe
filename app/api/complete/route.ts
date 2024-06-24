import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { basePrompt } from "@/lib/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to use environment variables for sensitive data
});

const systemSetup = basePrompt;
let conversationMemory: any = {};
const GPT4o = "gpt-4o";
export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const { prompt, newPrompt, sessionId, lesson_prompt } = await req.json();

      if (!sessionId) {
        return NextResponse.error();
      }

      // Reset conversation memory if newPrompt is true
      console.log(newPrompt);
      if (newPrompt) {
        conversationMemory[sessionId] = [
          {
            role: "system",
            content: basePrompt + ".\n" + "####\n" + lesson_prompt + "####",
          },
        ];
      }

      const previousMessages = conversationMemory[sessionId] || [];

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
      return NextResponse.json({
        text: aiResponse,
        conversation: conversationMemory[sessionId],
      });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return NextResponse.error();
    }
  } else {
    return NextResponse.error();
  }
}
