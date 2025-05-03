"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const ExcalidrawComponent = dynamic(
  () =>
    import("@excalidraw/excalidraw").then((mod) => {
      const { Excalidraw } = mod;
      return function ExcalidrawWrapper(props) {
        return <Excalidraw {...props} />;
      };
    }),
  { ssr: false }
);

// Test diagram data
const testDiagram = {
  "shapes": [
    {
      "type": "rectangle",
      "x": 400,
      "y": 40,
      "width": 300,
      "height": 100,
      "backgroundColor": "#e3f2fd",
      "text": "ExcalidrawComponent\nProps: nodeKey, data, width, height",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 150,
      "y": 180,
      "width": 280,
      "height": 80,
      "backgroundColor": "#fff9c4",
      "text": "Hooks & State\nuseLexicalComposerContext\nuseLexicalEditable\nuseState",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 550,
      "y": 180,
      "width": 280,
      "height": 80,
      "backgroundColor": "#fff9c4",
      "text": "Refs\nimageContainerRef\nbuttonRef\ncaptionButtonRef",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 50,
      "y": 300,
      "width": 220,
      "height": 80,
      "backgroundColor": "#f8bbd0",
      "text": "Event Handlers\ndeleteNode\nsetData\nonResizeStart/End",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 300,
      "y": 300,
      "width": 220,
      "height": 80,
      "backgroundColor": "#f8bbd0",
      "text": "Modal Control\nopenModal\ncloseModal\nisModalOpen",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 550,
      "y": 300,
      "width": 220,
      "height": 80,
      "backgroundColor": "#f8bbd0",
      "text": "Data Parsing\nuseMemo\nJSON.parse\nelements, files, appState",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 800,
      "y": 300,
      "width": 220,
      "height": 80,
      "backgroundColor": "#f8bbd0",
      "text": "Selection Control\nisSelected\nsetSelected\nclearSelection",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "diamond",
      "x": 400,
      "y": 420,
      "width": 320,
      "height": 100,
      "backgroundColor": "#e1bee7",
      "text": "Render Logic\nConditional Rendering\nModal & Image Display",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 100,
      "y": 560,
      "width": 250,
      "height": 80,
      "backgroundColor": "#dcedc8",
      "text": "ExcalidrawModal\nInitial Elements\nInitial Files\nInitial AppState",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 400,
      "y": 560,
      "width": 250,
      "height": 80,
      "backgroundColor": "#dcedc8",
      "text": "ExcalidrawImage\nImage Container\nElements Display",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    },
    {
      "type": "rectangle",
      "x": 700,
      "y": 560,
      "width": 250,
      "height": 80,
      "backgroundColor": "#dcedc8",
      "text": "ImageResizer\nResize Controls\nCaption Handling",
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "opacity": 100,
      "angle": 0
    }
  ],
  "connections": [
    {
      "type": "arrow",
      "style": "elbow",
      "start": [550, 80],
      "end": [290, 180],
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [550, 80],
      "end": [690, 180],
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "curved",
      "start": [290, 260],
      "end": [160, 300],
      "strokeColor": "#1e88e5",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle",
      "controlPoints": [[220, 280], [180, 290]]
    },
    {
      "type": "arrow",
      "style": "sharp",
      "start": [290, 260],
      "end": [410, 300],
      "strokeColor": "#1e88e5",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "curved",
      "start": [690, 260],
      "end": [660, 300],
      "strokeColor": "#1e88e5",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle",
      "controlPoints": [[670, 280], [665, 290]]
    },
    {
      "type": "arrow",
      "style": "curved",
      "start": [690, 260],
      "end": [910, 300],
      "strokeColor": "#1e88e5",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle",
      "controlPoints": [[800, 280], [850, 290]]
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [160, 380],
      "end": [560, 420],
      "strokeColor": "#6a1b9a",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [410, 380],
      "end": [560, 420],
      "strokeColor": "#6a1b9a",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [660, 380],
      "end": [560, 420],
      "strokeColor": "#6a1b9a",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [910, 380],
      "end": [560, 420],
      "strokeColor": "#6a1b9a",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [560, 520],
      "end": [225, 560],
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [560, 520],
      "end": [525, 560],
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    },
    {
      "type": "arrow",
      "style": "elbow",
      "start": [560, 520],
      "end": [825, 560],
      "strokeColor": "#000000",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "triangle"
    }
  ]
};

export default function TestDiagram() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the canvas
  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: [],
        appState: {
          currentItemStrokeColor: "#000000",
          currentItemBackgroundColor: "transparent",
          currentItemFillStyle: "solid",
          currentItemStrokeWidth: 2,
          currentItemRoughness: 1,
          currentItemOpacity: 100,
        },
      });
    }
  }, [excalidrawAPI]);

  const createShape = ({ 
    type, 
    x, 
    y, 
    width, 
    height, 
    backgroundColor = "transparent", 
    text, 
    strokeColor = "#000000",
    strokeWidth = 1,
    opacity = 100,
    angle = 0
  }) => {
    const now = Date.now();
    const rand = () => Math.floor(Math.random() * 100000);
    
    const shape = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      width,
      height,
      angle,
      strokeColor,
      backgroundColor,
      fillStyle: "solid",
      strokeWidth,
      roughness: 1,
      opacity,
      groupIds: [],
      seed: rand(),
      version: 1,
      versionNonce: rand(),
      isDeleted: false,
      boundElements: [],
      updated: now,
      link: null,
      locked: false,
    };

    if (text) {
      const fontSize = 20;
      const lineHeight = 1.2;
      const lines = text.split("\n");
      const textWidth = Math.max(...lines.map(line => line.length)) * (fontSize * 0.6);
      const textHeight = fontSize * lineHeight * lines.length;

      const textElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: x + width/2 - textWidth/2,
        y: y + height/2 - textHeight/2,
        width: textWidth,
        height: textHeight,
        angle: 0,
        strokeColor: "#000000",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 0,
        opacity: 100,
        groupIds: [],
        seed: rand(),
        version: 1,
        versionNonce: rand(),
        isDeleted: false,
        boundElements: [],
        updated: now,
        link: null,
        locked: false,
        fontSize,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        baseline: fontSize,
        text,
        raw: text,
        originalText: text,
        lineHeight: lineHeight,
      };

      return [shape, textElement];
    }

    return [shape];
  };

  const createConnection = ({ 
    type = "arrow", 
    style = "sharp",
    start, 
    end, 
    strokeColor = "#000000",
    strokeWidth = 1,
    startArrowhead = null,
    endArrowhead = "triangle",
    controlPoints = []
  }) => {
    const now = Date.now();
    const rand = () => Math.floor(Math.random() * 100000);

    let points;
    if (style === "elbow") {
      const midX = start[0];
      const midY = end[1];
      points = [
        [0, 0],
        [midX - start[0], 0],
        [midX - start[0], end[1] - start[1]],
        [end[0] - start[0], end[1] - start[1]]
      ];
    } else if (style === "curved" && controlPoints.length > 0) {
      points = [
        [0, 0],
        ...controlPoints.map(([x, y]) => [x - start[0], y - start[1]]),
        [end[0] - start[0], end[1] - start[1]]
      ];
    } else {
      points = [
        [0, 0],
        [end[0] - start[0], end[1] - start[1]]
      ];
    }

    return {
      id: crypto.randomUUID(),
      type,
      x: start[0],
      y: start[1],
      width: end[0] - start[0],
      height: end[1] - start[1],
      angle: 0,
      strokeColor,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      seed: rand(),
      version: 1,
      versionNonce: rand(),
      isDeleted: false,
      boundElements: [],
      updated: now,
      points,
      startArrowhead,
      endArrowhead,
    };
  };

  const analyzePromptWithGPT = async (prompt) => {
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze prompt');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      throw error;
    }
  };

  const generateDiagram = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, analyze the prompt with GPT
      const analysis = await analyzePromptWithGPT(prompt);
      
      // Generate diagram based on GPT's analysis
      const elements = [];
      
      // Process shapes from GPT analysis
      if (analysis.shapes && Array.isArray(analysis.shapes)) {
        analysis.shapes.forEach(shape => {
          elements.push(...createShape(shape));
        });
      }

      // Process connections from GPT analysis
      if (analysis.connections && Array.isArray(analysis.connections)) {
        analysis.connections.forEach(connection => {
          elements.push(createConnection(connection));
        });
      }

      excalidrawAPI.updateScene({ elements });
    } catch (err) {
      setError("Failed to generate diagram. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomArrow = (start, end, options = {}) => {
    const {
      strokeColor = "#000000",
      strokeWidth = 2,
      startArrowhead = null,
      endArrowhead = "triangle",
      controlPoints = [],
      arrowStyle = "sharp" // 'sharp', 'curved', 'elbow'
    } = options;
  
    // Calculate points based on arrow style
    let points;
    switch (arrowStyle) {
      case "curved":
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        points = [
          [0, 0],
          [midX - start[0], midY - start[1]],
          [end[0] - start[0], end[1] - start[1]]
        ];
        break;
      case "elbow":
        points = [
          [0, 0],
          [end[0] - start[0], 0],
          [end[0] - start[0], end[1] - start[1]]
        ];
        break;
      default: // sharp
        points = [
          [0, 0],
          [end[0] - start[0], end[1] - start[1]]
        ];
    }
  
    return {
      id: crypto.randomUUID(),
      type: "arrow",
      x: start[0],
      y: start[1],
      width: end[0] - start[0],
      height: end[1] - start[1],
      angle: 0,
      strokeColor,
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth,
      roughness: 1,
      opacity: 100,
      groupIds: [],
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: [],
      updated: Date.now(),
      points,
      startArrowhead,
      endArrowhead,
    };
  };

  // const testDiagramGeneration = () => {
  //   const elements = [];
    
  //   // Process shapes from test diagram
  //   testDiagram.shapes.forEach(shape => {
  //     elements.push(...createShape(shape));
  //   });

  //   // Process connections from test diagram
  //   testDiagram.connections.forEach(connection => {
  //     elements.push(createCustomArrow(connection));
  //   });

  //   excalidrawAPI.updateScene({ elements });
  // };
  const testDiagramGeneration = () => {
    const elements = [];
    
    // Process shapes from test diagram
    testDiagram.shapes.forEach(shape => {
      elements.push(...createShape(shape));
    });
  
    // Process connections from test diagram
    testDiagram.connections.forEach(connection => {
      // Create arrow using the connection's start and end points
      const arrow = createCustomArrow(
        connection.start,  // Start point from connection
        connection.end,    // End point from connection
        {
          strokeColor: connection.strokeColor || "#000000",
          strokeWidth: connection.strokeWidth || 2,
          startArrowhead: connection.startArrowhead || null,
          endArrowhead: connection.endArrowhead || "triangle",
          arrowStyle: connection.style || "sharp"
        }
      );
      elements.push(arrow);
    });
  
    excalidrawAPI.updateScene({ elements });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateDiagram(prompt);
    }
  };



  return (
    <div className="relative w-full h-screen">
      {/* Prompt Input */}
      <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your diagram..."
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={testDiagramGeneration}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Test Diagram
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Drawing Canvas */}
      <div className="w-full h-full">
        <ExcalidrawComponent
          excalidrawAPI={setExcalidrawAPI}
          theme="light"
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
              export: false,
              toggleTheme: false,
            },
          }}
        />
      </div>
    </div>
  );
}