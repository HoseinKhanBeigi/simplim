import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const systemPrompt = `You are a diagram generation expert. Given any description of a process, system, or concept, generate a complete React Flow configuration.
    Return the response in the following JSON format:
    {
      "nodeTypes": {
        "default": {
          "component": "DefaultNode",
          "style": {
            "border": "border-gray-400",
            "bg": "bg-gray-500"
          }
        },
        "input": {
          "component": "InputNode",
          "style": {
            "border": "border-blue-400",
            "bg": "bg-blue-500"
          }
        },
        "output": {
          "component": "OutputNode",
          "style": {
            "border": "border-green-400",
            "bg": "bg-green-500"
          }
        },
        "process": {
          "component": "ProcessNode",
          "style": {
            "border": "border-purple-400",
            "bg": "bg-purple-500"
          }
        },
        "decision": {
          "component": "DecisionNode",
          "style": {
            "border": "border-yellow-400",
            "bg": "bg-yellow-500"
          }
        }
      },
      "initialNodes": [
        {
          "id": "unique_id",
          "type": "default|input|output|process|decision",
          "data": {
            "label": "short_label",
            "description": "detailed_description"
          },
          "position": { "x": number, "y": number }
        }
      ],
      "initialEdges": [
        {
          "id": "unique_id",
          "source": "source_node_id",
          "target": "target_node_id",
          "type": "custom",
          "animated": true,
          "label": "optional_edge_label"
        }
      ]
    }

    Guidelines:
    1. Node Types:
       - default: for general nodes (gray)
       - input: for starting points (blue)
       - output: for end points (green)
       - process: for actions (purple)
       - decision: for conditional branches (yellow)
       - Each node type must have proper styling

    2. Node Layout:
       - Position nodes in a logical flow (left to right)
       - Space nodes appropriately (x: 50-650, y: 50-500)
       - Group related nodes together
       - Maintain consistent spacing
       - Ensure all IDs are unique

    3. Node Content:
       - Use clear, concise labels
       - Provide detailed descriptions
       - Match node types to their purpose
       - Keep descriptions informative but brief

    4. Edge Configuration:
       - Connect nodes logically
       - Use edge labels when needed
       - Make edges animated
       - Ensure all connections are valid
       - Use custom edge type

    5. Special Considerations:
       - Decision nodes should have multiple outgoing edges
       - Input nodes should be at the start
       - Output nodes should be at the end
       - Process nodes should be in the middle
       - Default nodes for any other cases

    6. Styling Guidelines:
       - Use consistent colors for each node type
       - Maintain proper spacing
       - Ensure good visual hierarchy
       - Keep the diagram organized and readable`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const diagramConfig = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(diagramConfig);
  } catch (error) {
    console.error('Error generating diagram:', error);
    return NextResponse.json(
      { error: 'Failed to generate diagram' },
      { status: 500 }
    );
  }
} 