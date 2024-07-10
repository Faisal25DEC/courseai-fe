import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { scorecardQuestions, conversation } = await req.json();

    const gptRequests = scorecardQuestions.map((question: any) => ({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Here is a conversation: ${conversation}` },
        { role: 'user', content: `Based on the conversation, answer the following question with a yes or no: ${question}` }
      ],
      max_tokens: 50
    }));

    const responses = await Promise.all(gptRequests.map((req: any) => 
      axios.post(
        'https://api.openai.com/v1/chat/completions',
        req,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      )
    ));

    const answers = responses.map(response => 
      response.data.choices[0].message.content.trim().toLowerCase() === 'yes'
    );

    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Error calling GPT API:', error);
    return NextResponse.json({ error: 'Error calling GPT API' }, { status: 500 });
  }
}
