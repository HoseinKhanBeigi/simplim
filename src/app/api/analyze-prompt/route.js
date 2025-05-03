import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are a diagram analysis expert specializing in code architecture and component flows. Analyze the user's prompt and return a structured JSON response with the following format:
{
  "shapes": [
    {
      "type": "rectangle|ellipse|diamond|arrow|line",
      "x": number,  // x-coordinate (0-1000)
      "y": number,  // y-coordinate (0-1000)
      "width": number,  // width in pixels (calculated based on text)
      "height": number,  // height in pixels (calculated based on text)
      "backgroundColor": "hex color",  // e.g., "#e3f2fd"
      "text": "shape label",  // optional text label
      "strokeColor": "hex color",  // border color, default "#000000"
      "strokeWidth": number,  // border width, default 1
      "opacity": number,  // 0-100, default 100
      "angle": number  // rotation angle in degrees, default 0
    }
  ],
  "connections": [
    {
      "type": "arrow|line",
      "style": "elbow|sharp|curved",
      "start": [x, y],
      "end": [x, y],
      "strokeColor": "hex color",
      "strokeWidth": number,
      "startArrowhead": "triangle|null",
      "endArrowhead": "triangle|null",
      "controlPoints": [[x, y], [x, y]]
    }
  ]
}

Consider the following guidelines:

1. Code Architecture Guidelines:
   - Start with factory functions (e.g., $createNode)
   - Show class definitions and their relationships
   - Display component rendering flow
   - Illustrate data flow and state management
   - Show serialization/deserialization paths
   - Use clear labels for each architectural element

2. Component Flow Guidelines:
   - Use elbow arrows for process flows
   - Use sharp arrows for direct relationships
   - Use curved arrows for data transformations
   - Label arrows with their purpose (e.g., "renders", "transforms", "serializes")
   - Show clear entry and exit points
   - Illustrate component lifecycle

3. Text Size Calculation:
   - For each shape with text, calculate width and height based on:
     * Font size: 16px
     * Line height: 1.2
     * Character width: 8px (approximate)
     * Padding: 20px on each side
   - Width calculation:
     * Find the longest line in the text
     * Width = (longest line length * 8px) + 40px padding
     * Minimum width: 100px
   - Height calculation:
     * Count number of lines in text
     * Height = (number of lines * 16px * 1.2) + 40px padding
     * Minimum height: 50px

4. Layout Guidelines:
   - Arrange shapes in a logical flow (top to bottom, left to right)
   - Use consistent spacing (50-100 pixels between shapes)
   - Keep shapes within 0-1000 coordinate range
   - Avoid overlapping shapes
   - Use calculated sizes based on text content
   - Add extra padding for readability

5. Styling Guidelines:
   - Use consistent color scheme:
     * Factory functions: #e3f2fd (light blue)
     * Class definitions: #fff9c4 (light yellow)
     * Components: #f8bbd0 (light pink)
     * Data/State: #dcedc8 (light green)
     * Utility functions: #e1bee7 (light purple)
   - Use dark colors for text and borders
   - Add meaningful labels to shapes
   - Choose arrow style that best represents the relationship

6. Connection Guidelines:
   - Use elbow arrows for:
     * Process flows
     * Component lifecycle
     * Factory to class relationships
   - Use sharp arrows for:
     * Direct data flow
     * Immediate transformations
     * Direct relationships
   - Use curved arrows for:
     * Data transformations
     * Asynchronous operations
     * Event handling
   - Always label connections with their purpose
   - Use appropriate arrowheads for direction

7. Text Guidelines:
   - Keep labels concise and clear
   - Center text within shapes
   - Ensure text fits within calculated dimensions
   - Break long text into multiple lines if needed
   - Add padding around text for readability
   - Use consistent terminology

8. Special Cases for Code Diagrams:
   - Factory Functions:
     * Show input parameters
     * Show output type
     * Connect to class definition
   - Class Definitions:
     * Show inheritance
     * Show interface implementation
     * Show key methods
   - Component Rendering:
     * Show render pipeline
     * Show props flow
     * Show state management
   - Data Flow:
     * Show data transformations
     * Show state updates
     * Show event handling
   - Serialization:
     * Show export path
     * Show import path
     * Show data format`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the GPT response
    const analysis = JSON.parse(completion.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze prompt' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 