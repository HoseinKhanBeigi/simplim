import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a diagram generation assistant. Convert the user's prompt into a diagram structure.
          Return a JSON array of commands that can be used to draw the diagram. Each command should have:
          - type: 'rectangle', 'ellipse', 'diamond', 'arrow', or 'line'
          - x, y: position coordinates
          - width, height: dimensions
          - strokeColor: border color
          - backgroundColor: fill color
          - fillStyle: 'solid' or 'hachure'
          - text: optional text content
          - points: for arrows and lines, array of [x,y] points
          - startArrowhead, endArrowhead: for arrows, can be 'arrow' or null
          
          The diagram should be well-organized and visually appealing.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate diagram' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 