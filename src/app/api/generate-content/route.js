import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Here we'll use GPT to generate structured content
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a content generation expert. Analyze the user's prompt and return a structured JSON response with the following format:
{
  "content": [
    {
      "type": "heading|paragraph|list|quote|code|table",
      "content": "text content",
      "level": number,  // for headings (1-6)
      "style": "ordered|unordered",  // for lists
      "items": ["item1", "item2"],  // for lists
      "language": "javascript|python|etc",  // for code blocks
      "columns": ["col1", "col2"],  // for tables
      "rows": [["row1col1", "row1col2"], ["row2col1", "row2col2"]]  // for tables
    }
  ]
}

Consider the following guidelines:
1. Use appropriate content types based on the prompt
2. Structure content logically with headings and paragraphs
3. Use lists for enumerations or steps
4. Use code blocks for technical content
5. Use tables for structured data
6. Use quotes for important statements or citations`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 