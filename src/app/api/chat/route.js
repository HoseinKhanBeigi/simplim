import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, context, conversationHistory = [] } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context from history
    const messages = [
      {
        role: "system",
        content: `You are a helpful AI assistant that works across different pages (viewer, doceditor, easychart, flowbuilder). 
        You maintain context across all conversations and pages. Be helpful, concise, and adapt to the user's needs.
        Current context: ${context || 'general'}`
      },
      // Add conversation history (last 10 messages)
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messages,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ 
      response,
      message: response // Alias for compatibility
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', message: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}

