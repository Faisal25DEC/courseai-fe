import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to use environment variables for sensitive data
});

const systemSetup = `You are an AI assistant which answers queries`;
let conversationMemory: any = {};

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const { prompt, newPrompt, sessionId } = await req.json();

      if (!sessionId) {
        return NextResponse.error();
      }

      // Reset conversation memory if newPrompt is true
      if (newPrompt) {
        conversationMemory[sessionId] = [
          {
            role: "system",
            content: prompt,
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
        model: "gpt-3.5-turbo",
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
      return NextResponse.json({ text: aiResponse });
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return NextResponse.error();
    }
  } else {
    return NextResponse.error();
  }
}
