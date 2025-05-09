import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Domain-specific shape definitions
const DOMAIN_SHAPES = {
  coding: {
    class: {
      type: "rectangle",
      style: "class-box",
      properties: ["methods", "attributes", "visibility"],
      defaultHeight: 120,
      defaultWidth: 200
    },
    interface: {
      type: "rectangle",
      style: "interface-box",
      properties: ["methods", "attributes", "visibility"],
      defaultHeight: 100,
      defaultWidth: 180
    },
    package: {
      type: "rectangle",
      style: "package-box",
      properties: ["name", "elements"],
      defaultHeight: 150,
      defaultWidth: 250
    },
    component: {
      type: "rectangle",
      style: "component-box",
      properties: ["name", "interfaces"],
      defaultHeight: 80,
      defaultWidth: 160
    }
  },
  math: {
    node: {
      type: "circle",
      style: "graph-node",
      properties: ["value", "label"],
      defaultRadius: 30
    },
    edge: {
      type: "line",
      style: "graph-edge",
      properties: ["weight", "direction"],
      defaultWidth: 2
    },
    triangle: {
      type: "polygon",
      style: "triangle",
      properties: ["angles", "sides"],
      defaultHeight: 100,
      defaultWidth: 100
    }
  },
  biology: {
    cell: {
      type: "ellipse",
      style: "cell",
      properties: ["type", "organelles"],
      defaultHeight: 120,
      defaultWidth: 80
    },
    molecule: {
      type: "polygon",
      style: "molecule",
      properties: ["atoms", "bonds"],
      defaultHeight: 60,
      defaultWidth: 60
    },
    organ: {
      type: "custom",
      style: "organ",
      properties: ["type", "function"],
      defaultHeight: 100,
      defaultWidth: 100
    }
  },
  social: {
    person: {
      type: "circle",
      style: "person",
      properties: ["name", "role"],
      defaultRadius: 40
    },
    institution: {
      type: "rectangle",
      style: "institution",
      properties: ["name", "type"],
      defaultHeight: 80,
      defaultWidth: 160
    },
    relationship: {
      type: "line",
      style: "relationship",
      properties: ["type", "strength"],
      defaultWidth: 2
    }
  }
};

export async function POST(req) {
  try {
    const { prompt, domain } = await req.json();

    const systemPrompt = `You are a diagram analysis expert specializing in ${domain || 'general'} diagrams. Analyze the user's prompt and return a structured JSON response with the following format:
{
  "domain": "${domain || 'general'}",
  "shapes": [
    {
      "type": "rectangle|ellipse|diamond|arrow|line|circle|polygon|custom",
      "style": "string",  // domain-specific style
      "x": number,  // x-coordinate (0-1000)
      "y": number,  // y-coordinate (0-1000)
      "width": number,  // width in pixels
      "height": number,  // height in pixels
      "radius": number,  // for circles
      "backgroundColor": "hex color",  // e.g., "#e3f2fd"
      "text": "shape label",  // optional text label
      "strokeColor": "hex color",  // border color, default "#000000"
      "strokeWidth": number,  // border width, default 1
      "opacity": number,  // 0-100, default 100
      "angle": number,  // rotation angle in degrees, default 0
      "properties": {  // domain-specific properties
        "key": "value"
      }
    }
  ],
  "connections": [
    {
      "type": "arrow|line|relationship",
      "style": "elbow|curved|sharp|dashed|dotted",
      "start": [x, y],
      "end": [x, y],
      "strokeColor": "hex color",
      "strokeWidth": number,
      "startArrowhead": "triangle|null",
      "endArrowhead": "triangle|null",
      "controlPoints": [
        [x, y],
        [x, y]
      ],
      "properties": {  // domain-specific properties
        "key": "value"
      }
    }
  ]
}

Consider the following guidelines:

1. Domain-Specific Shapes:
${Object.entries(DOMAIN_SHAPES).map(([domain, shapes]) => `
   ${domain.toUpperCase()}:
   ${Object.entries(shapes).map(([shape, config]) => `
   - ${shape}: ${config.type} with ${config.style} style
     * Properties: ${config.properties.join(', ')}
     * Default size: ${config.defaultHeight}x${config.defaultWidth || config.defaultRadius}`).join('\n')}`).join('\n')}

2. Layout Guidelines:
   - Arrange shapes in a logical flow
   - Use consistent spacing (50-100 pixels between shapes)
   - Keep shapes within 0-1000 coordinate range
   - Avoid overlapping shapes
   - Use appropriate sizes based on domain
   - Choose connection style based on domain and readability

3. Styling Guidelines:
   - Use domain-appropriate colors
   - Maintain consistent styling within domains
   - Use appropriate line styles for connections
   - Add meaningful labels and properties
   - Consider domain-specific conventions

4. Connection Guidelines:
   - Use domain-appropriate connection types
   - Maintain clear relationships
   - Avoid crossing connections when possible
   - Use appropriate arrowheads and line styles
   - Add domain-specific properties to connections`;

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