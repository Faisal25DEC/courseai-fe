import OpenAI from "openai";
import { basePrompt } from "../constants";

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
      messages: [
        ...previousMessages,
        {
          role: "user",
          content: newPrompt ? "Act according to given guidelines" : prompt,
        },
      ],
    });

    // Get the AI's response
    const aiResponse = chatCompletion.choices[0].message.content;

    // Update the conversation memory with the new messages
    conversationMemory[sessionId] = [
      ...previousMessages,
      {
        role: "user",
        content: newPrompt ? "Act according to given guidelines" : prompt,
      },
      { role: "assistant", content: aiResponse },
    ];

    console.log(conversationMemory);
    return { text: aiResponse, conversation: conversationMemory[sessionId] };
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return null;
  }
}
